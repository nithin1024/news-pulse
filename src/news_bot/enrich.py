"""
LLM enrichment for Telugu Stock Market News Pulse (తెలుగు మార్కెట్ పల్స్).
Produces per-item Telugu summaries, why it matters, topic category,
sentiment (సానుకూలం, ప్రతికూలం, తటస్థం, మిశ్రమ ప్రభావం), market impact analysis,
affected stocks and sectors, and importance ranking.
Also generates Daily Market Briefings and Weekly Digests in Telugu.
"""

import json
import logging
import re
from datetime import timedelta
from urllib.parse import quote

from news_bot.llm import GroqClient, LLMUnavailableError
from news_bot.textutil import parse_iso, utcnow

log = logging.getLogger("news-bot.enrich")


def _translate_to_telugu(text: str) -> str:
    """Translate English text to Telugu using Google Translate (free, no API key).
    Falls back to the original text on any error."""
    if not text or not text.strip():
        return text
    # Skip if already contains Telugu characters
    if re.search(r'[\u0C00-\u0C7F]', text):
        return text
    try:
        import urllib.request
        # Google Translate unofficial API endpoint (free, no key needed)
        url = (
            "https://translate.googleapis.com/translate_a/single"
            f"?client=gtx&sl=en&tl=te&dt=t&q={quote(text[:500])}"
        )
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            # Response format: [[["translated text","source text",...],...],...]
            translated = "".join(part[0] for part in data[0] if part[0])
            return translated if translated.strip() else text
    except Exception as e:
        log.debug("Translation failed for '%s...': %s", text[:40], e)
        return text

CATEGORIES = {
    "indian_markets": "భారతీయ మార్కెట్లు",
    "stocks_in_news": "Stocks in News",
    "global_markets": "ప్రపంచ మార్కెట్లు",
    "fii_dii": "FII / DII ప్రవాహాలు",
    "commodities_forex": "కమోడిటీలు & కరెన్సీ",
    "earnings": "ఫలితాలు & కార్పొరేట్ చర్యలు",
    "ipo": "IPO వార్తలు",
    "economy": "ఆర్థిక విధానాలు & స్థూల డేటా",
    "other": "ఇతర మార్కెట్ వార్తలు",
}

SENTIMENT_MAP = {
    "positive": "సానుకూలం",
    "negative": "ప్రతికూలం",
    "neutral": "తటస్థం",
    "mixed": "మిశ్రమ ప్రభావం",
}

_SOURCE_DEFAULT = {
    "indian_markets": "indian_markets",
    "stocks_in_news": "stocks_in_news",
    "global_markets": "global_markets",
    "fii_dii": "fii_dii",
    "commodities_forex": "commodities_forex",
    "earnings": "earnings",
    "ipo": "ipo",
    "economy": "economy",
    "other": "other",
    # Legacy fallbacks:
    "labs": "global_markets",
    "research": "economy",
    "opensource": "stocks_in_news",
    "news": "indian_markets",
    "events": "economy",
    "community": "indian_markets",
    "analysis": "indian_markets",
}

BATCH_SIZE = 6
MAX_ATTEMPTS = 3

ITEM_SYSTEM = """నువ్వు ఒక సీనియర్ ఫైనాన్షియల్ న్యూస్ అనలిస్ట్ మరియు "తెలుగు మార్కెట్ పల్స్" (Telugu Stock Market News Pulse) ప్రధాన సంపాదకుడివి.

ప్రధాన నిబంధనలు:
1. ఈ వెబ్సైట్లో కేవలం Stock Marketకు సంబంధించిన వార్తలు మాత్రమే ఉండాలి.
2. స్టాక్ మార్కెట్, కంపెనీ షేర్లు లేదా మార్కెట్ కదలికలతో ప్రత్యక్ష/పరోక్ష సంబంధం లేని వార్తలను పూర్తిగా తిరస్కరించాలి ("importance": 1, "category": "other").
3. ప్రపంచ వార్తలను అవి భారతీయ మార్కెట్లను ఎలా ప్రభావితం చేస్తాయో (ఉదా: Tariffs, Crude, Fed Rates) స్పష్టమైన మార్కెట్ ప్రభావం ఉన్నప్పుడు మాత్రమే చేర్చు.
4. అన్ని వివరణలు, సారాంశాలు, శీర్షికలు, ప్రభావ విశ్లేషణలు తప్పనిసరిగా తెలుగులోనే రాయాలి.
5. కంపెనీల అసలు పేర్లు, Stock Tickers, NIFTY 50, FII, DII, IPO వంటి ప్రామాణిక పదాలను ఆంగ్లంలో ఉంచవచ్చు.
6. సాంకేతిక పదాలు వచ్చినప్పుడు సరళమైన తెలుగు అర్థం ఇవ్వాలి.

ప్రతి వార్తకు క్రింది JSON ఫీల్డ్స్ ఇవ్వాలి:
- "id": ఇన్పుట్ ఐడీ
- "title_te": ఆకర్షణీయమైన, స్పష్టమైన తెలుగు శీర్షిక
- "summary_te": అసలు వార్తలో జరిగిన వాస్తవాన్ని వివరిస్తూ 1-2 స్పష్టమైన తెలుగు వాక్యాలు
- "why_it_matters_te": ఇన్వెస్టర్లకు లేదా మార్కెట్కు ఇది ఎందుకు ముఖ్యమో తెలుగులో 1 వాక్యం
- "category": indian_markets, stocks_in_news, global_markets, fii_dii, commodities_forex, earnings, ipo, economy, other
- "sentiment": "positive", "negative", "neutral", లేదా "mixed"
- "sentiment_label_te": "సానుకూలం", "ప్రతికూలం", "తటస్థం", లేదా "మిశ్రమ ప్రభావం"
- "importance": 1 నుంచి 5 వరకు (5 = అత్యంత కీలకం, 1 = అనవసరం)
- "news_strength": "Strong", "Moderate", లేదా "Weak" (వార్త యొక్క బలం)
- "intraday_action": "WAIT", "WATCH", "UPSIDE SETUP", "DOWNSIDE SETUP", లేదా "AVOID NEWS-ONLY TRADE"
- "affected_stocks": ప్రభావితమైన కంపెనీల టిక్కర్లు లేదా పేర్లు (ఉదా: ["RELIANCE"])
- "affected_sectors": ప్రభావిత రంగాలు
- "market_impact_te": సాధ్యమైన మార్కెట్ ప్రభావం మరియు కారణం (తెలుగులో).

Reply with JSON: {"items": [{"id": "...", "title_te": "...", "summary_te": "...", "why_it_matters_te": "...", "category": "...", "sentiment": "positive", "sentiment_label_te": "సానుకూలం", "importance": 4, "news_strength": "Strong", "intraday_action": "WAIT", "affected_stocks": [...], "affected_sectors": [...], "market_impact_te": "..."}]}"""

DAILY_SYSTEM = """నువ్వు 'తెలుగు మార్కెట్ పల్స్' ప్రధాన ఆర్థిక సంపాదకుడివి. గత 24 గంటల స్టాక్ మార్కెట్ పరిణామాల ఆధారంగా 'ఈరోజు మార్కెట్ డైలీ బ్రీఫింగ్' (Daily Market Brief) రాయాలి.
భాష పూర్తిగా తెలుగులోనే ఉండాలి. సాంకేతిక పదాలు, టిక్కర్లు ఇంగ్లీష్లో ఉండవచ్చు.

Return JSON:
{
  "headline": "నేటి మార్కెట్ ప్రధాన పరిణామం శీర్షిక (తెలుగులో)",
  "bullets": [
    {
      "text": "1-2 స్పష్టమైన తెలుగు వాక్యాలలో NIFTY, SENSEX, కీలక రంగాలు మరియు కంపెనీల విశ్లేషణ",
      "ids": ["వార్త id 1", "వార్త id 2"]
    }
  ]
}
4-8 ముఖ్యమైన బుల్లెట్ పాయింట్లు రాయి. ప్రతి బుల్లెట్కు కనీసం ఒక ఇన్పుట్ ID ఇవ్వాలి."""

WEEKLY_SYSTEM = """నువ్వు 'తెలుగు మార్కెట్ పల్స్' ప్రధాన మార్కెట్ విశ్లేషకుడివి. గత వారం రోజులలో స్టాక్ మార్కెట్లో జరిగిన కీలక పరిణామాలను సమీక్షిస్తూ 'వారపు మార్కెట్ నివేదిక' (Weekly Market Review) రూపొందించాలి.
వివరణ పూర్తిగా స్పష్టమైన తెలుగులో ఉండాలి.

Return JSON:
{
  "overview": "గత వారం మార్కెట్ ధోరణి, NIFTY 50 / SENSEX కదలికలు, FII / DII నిధుల ప్రవాహంపై 3-4 వాక్యాల తెలుగు సారాంశం",
  "sections": [
    {
      "title": "విభాగం శీర్షిక (ఉదా: భారతీయ సూచీల ర్యాలీ, త్రైమాసిక ఫలితాలు, క్రూడ్ ఆయిల్ ప్రభావం)",
      "bullets": [
        {
          "text": "1-2 వాక్యాల స్పష్టమైన తెలుగు విశ్లేషణ",
          "ids": ["story id", ...]
        }
      ]
    }
  ]
}
3-5 విభాగాలు, ప్రతి విభాగంలో 2-4 ముఖ్యమైన బుల్లెట్లు ఉండాలి."""


def default_category(item: dict) -> str:
    src_cat = item.get("src_category", "")
    return _SOURCE_DEFAULT.get(src_cat, "other")


def _priority(item: dict, now) -> float:
    age_days = (now - parse_iso(item["published"])).total_seconds() / 86400
    return item.get("weight", 3) * 2 - age_days * 1.5


def pending(items: list[dict], max_age_days: int = 7) -> list[dict]:
    """Items still needing enrichment, highest priority first."""
    now = utcnow()
    out = []
    for item in items:
        if item.get("ai") or item.get("ai_attempts", 0) >= MAX_ATTEMPTS:
            continue
        age = now - parse_iso(item["published"])
        if age > timedelta(days=max_age_days) and item.get("weight", 3) < 4:
            continue
        out.append(item)
    return sorted(out, key=lambda i: _priority(i, now), reverse=True)


def _item_prompt(batch: list[dict]) -> str:
    rows = []
    for item in batch:
        rows.append(
            {
                "id": item["id"],
                "source": item["source_name"],
                "category_hint": item.get("src_category", "indian_markets"),
                "title": item["title"],
                "excerpt": (item.get("excerpt") or "")[:500],
            }
        )
    return json.dumps({"items": rows}, ensure_ascii=False)


def _extract_tickers(text: str) -> list[str]:
    known = [
        "RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "BHARTIARTL",
        "ITC", "LT", "HINDUNILVR", "TATAMOTORS", "TATASTEEL", "MARUTI", "BAJFINANCE",
        "WIPRO", "HCLTECH", "SUNPHARMA", "NTPC", "POWERGRID", "TITAN", "ONGC",
        "ADANIENT", "ADANIPORTS", "COALINDIA", "JSWSTEEL", "AXISBANK", "KOTAKBANK"
    ]
    found = []
    for sym in known:
        if re.search(r"\b" + sym + r"\b", text, re.IGNORECASE):
            found.append(sym)
    return found[:4]


def _extract_sectors(text: str) -> list[str]:
    sectors = {
        "Banking": r"\b(bank|banks|nbfc|rbi|lending)\b",
        "IT": r"\b(it|software|tech|tcs|infosys|wipro|ai)\b",
        "Auto": r"\b(auto|car|ev|automobile|motors)\b",
        "Pharma": r"\b(pharma|healthcare|drug|hospital)\b",
        "Energy": r"\b(oil|crude|petrol|gas|energy|power|solar)\b",
        "Metals": r"\b(steel|metal|mining|copper|aluminum|gold|silver)\b",
        "FMCG": r"\b(fmcg|consumer|goods|itc|retail)\b",
        "Realty": r"\b(real estate|realty|housing|construction)\b",
        "Defence": r"\b(defence|defense|aerospace)\b",
    }
    found = []
    for name, pat in sectors.items():
        if re.search(pat, text, re.IGNORECASE):
            found.append(name)
    return found[:3]


def fallback_enrichment(item: dict) -> dict:
    """Generate structured Telugu enrichment fields when LLM is unavailable or offline."""
    title = item.get("title", "")
    excerpt = item.get("excerpt", "")
    full_text = f"{title} {excerpt}"

    # Determine category
    src_cat = item.get("src_category", "")
    cat = _SOURCE_DEFAULT.get(src_cat, "indian_markets")
    if "ipo" in full_text.lower():
        cat = "ipo"
    elif any(k in full_text.lower() for k in ["q1", "q2", "q3", "q4", "profit", "results", "dividend"]):
        cat = "earnings"
    elif any(k in full_text.lower() for k in ["crude", "oil", "gold", "dollar", "rupee", "forex"]):
        cat = "commodities_forex"
    elif any(k in full_text.lower() for k in ["fed", "us market", "wall street", "nasdaq", "dow"]):
        cat = "global_markets"
    elif any(k in full_text.lower() for k in ["fii", "dii", "foreign investor"]):
        cat = "fii_dii"
    elif any(k in full_text.lower() for k in ["rbi", "inflation", "cpi", "gdp", "repo rate"]):
        cat = "economy"

    # Sentiment analysis
    pos_re = r"\b(gain|gains|rallies|rally|surge|surges|jump|jumps|profit|rise|rises|high|record|bull)\b"
    neg_re = r"\b(fall|falls|drop|drops|slump|slumps|loss|losses|plunge|crash|decline|bear|down)\b"
    is_pos = bool(re.search(pos_re, full_text, re.IGNORECASE))
    is_neg = bool(re.search(neg_re, full_text, re.IGNORECASE))

    if is_pos and is_neg:
        sentiment = "mixed"
    elif is_pos:
        sentiment = "positive"
    elif is_neg:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    stocks = _extract_tickers(full_text)
    sectors = _extract_sectors(full_text)

    # Importance heuristic
    weight = item.get("weight", 3)
    importance = min(5, max(2, weight))
    if any(k in full_text.lower() for k in ["nifty", "sensex", "rbi", "fed", "budget", "all-time high", "crash"]):
        importance = max(importance, 4)

    # Basic Telugu phrasing based on sentiment and title
    # Translate title and summary to Telugu using free Google Translate
    title_te = _translate_to_telugu(title)
    summary_te = _translate_to_telugu(excerpt[:240]) if excerpt else title_te
    why_te = "ఈ వార్త సంబంధిత కంపెనీ షేర్లు మరియు రంగాల సెంటిమెంట్పై తక్షణ ప్రభావం చూపే అవకాశం ఉంది."

    impact_desc = {
        "positive": "ఈ పరిణామం మార్కెట్ లేదా సంబంధిత రంగాల షేర్లకు సానుకూల ఊపునివ్వవచ్చు.",
        "negative": "ఈ పరిణామం కారణంగా స్వల్పకాలిక అమ్మకాల ఒత్తిడి ఏర్పడే అవకాశం ఉంది.",
        "neutral": "ఈ వార్త తటస్థ మార్కెట్ పరిధిలోనే ఉంది; ప్రత్యక్ష తీవ్ర ప్రభావం పరిమితం.",
        "mixed": "కొన్ని రంగాలకు సానుకూలంగా, మరికొన్ని రంగాలకు ప్రతికూలంగా మిశ్రమ ప్రభావం ఉండవచ్చు.",
    }[sentiment]

    return {
        "title_te": title_te,
        "summary_te": summary_te,
        "why_it_matters_te": why_te,
        "category": cat,
        "sentiment": sentiment,
        "sentiment_label_te": SENTIMENT_MAP[sentiment],
        "importance": importance,
        "affected_stocks": stocks,
        "affected_sectors": sectors or ["General Market"],
        "market_impact_te": impact_desc,
        "impact_horizon": "short-term",
        "confidence": "medium",
        "tags": [s.lower() for s in stocks[:2]] + [sec.lower() for sec in sectors[:2]],
    }


def clean_ai(raw: dict) -> dict | None:
    """Validate and clean the LLM enrichment output, applying Telugu safety defaults."""
    if not isinstance(raw, dict) or not raw:
        return None

    summary_te = str(raw.get("summary_te") or raw.get("summary") or "").strip()
    if not summary_te:
        return None

    title_te = str(raw.get("title_te") or raw.get("title") or "").strip()
    why_it_matters_te = str(raw.get("why_it_matters_te") or raw.get("why") or "").strip()
    market_impact_te = str(raw.get("market_impact_te") or raw.get("market_impact") or "").strip()

    category = str(raw.get("category") or "").strip().lower()
    if category not in CATEGORIES:
        category = "indian_markets"

    sentiment = str(raw.get("sentiment") or "neutral").strip().lower()
    if sentiment not in SENTIMENT_MAP:
        sentiment = "neutral"
    sentiment_label_te = raw.get("sentiment_label_te") or SENTIMENT_MAP.get(sentiment, "తటస్థం")

    try:
        importance = max(1, min(5, int(raw.get("importance", 3))))
    except (TypeError, ValueError):
        importance = 3

    stocks = raw.get("affected_stocks")
    if not isinstance(stocks, list):
        stocks = _extract_tickers(title_te) if title_te else []
    else:
        stocks = [str(s).strip().upper() for s in stocks if str(s).strip()][:6]

    sectors = raw.get("affected_sectors")
    if not isinstance(sectors, list):
        sectors = _extract_sectors(title_te) if title_te else []
    else:
        sectors = [str(s).strip() for s in sectors if str(s).strip()][:5]

    horizon = str(raw.get("impact_horizon") or "short-term").strip().lower()
    if horizon not in ("intraday", "short-term", "long-term", "uncertain"):
        horizon = "short-term"

    confidence = str(raw.get("confidence") or "medium").strip().lower()
    if confidence not in ("high", "medium", "low"):
        confidence = "medium"

    tags = raw.get("tags") or []
    if not isinstance(tags, list):
        tags = []

    news_strength = str(raw.get("news_strength") or "Moderate").strip().title()
    if news_strength not in ("Strong", "Moderate", "Weak"):
        news_strength = "Moderate"

    intraday_action = str(raw.get("intraday_action") or "WATCH").strip().upper()

    return {
        "title_te": title_te[:300],
        "summary": summary_te[:650],
        "summary_te": summary_te[:650],
        "why": why_it_matters_te[:400],
        "why_it_matters_te": why_it_matters_te[:400],
        "category": category,
        "sentiment": sentiment,
        "sentiment_label_te": sentiment_label_te,
        "importance": importance,
        "news_strength": news_strength,
        "intraday_action": intraday_action,
        "impact_horizon": horizon,
        "confidence": confidence,
        "tags": tags,
        "affected_stocks": stocks,
        "affected_sectors": sectors,
        "market_impact_te": market_impact_te[:500] or f"{sentiment_label_te} ప్రభావం చూపే అవకాశం ఉంది.",
        "impact_horizon": horizon,
        "confidence": confidence,
        "tags": [str(t).strip().lower()[:30] for t in tags if str(t).strip()][:5],
    }


def enrich_items(llm: GroqClient | None, items: list[dict], limit: int) -> list[dict]:
    """Enrich pending items with Telugu summaries and impact metadata."""
    backlog = pending(items)
    queue = backlog[:limit]
    touched: list[dict] = []
    log.info("Enriching %d of %d pending items.", len(queue), len(backlog))

    if llm is None:
        log.info("GroqClient not provided; running rule-based Telugu enrichment.")
        for item in queue:
            item["ai"] = fallback_enrichment(item)
            item.pop("ai_attempts", None)
            touched.append(item)
        return touched

    for start in range(0, len(queue), BATCH_SIZE):
        batch = queue[start : start + BATCH_SIZE]
        try:
            reply = llm.chat_json(ITEM_SYSTEM, _item_prompt(batch), max_tokens=3500)
        except LLMUnavailableError as exc:
            log.warning("Stopping enrichment early: %s", exc)
            break

        by_id = {str(r.get("id")): r for r in reply.get("items", []) if isinstance(r, dict)}
        for item in batch:
            ai = clean_ai(by_id.get(item["id"], {}))
            if ai:
                item["ai"] = ai
                item.pop("ai_attempts", None)
            else:
                item["ai_attempts"] = item.get("ai_attempts", 0) + 1
            touched.append(item)
    return touched


# -- briefs -------------------------------------------------------------------


def _story_lines(stories: list[dict], limit: int) -> str:
    rows = []
    for s in stories[:limit]:
        rows.append(
            {
                "id": s["id"],
                "title": s.get("title_te") or s["title"],
                "sources": [s["source_name"], *[a["source_name"] for a in s.get("also", [])][:3]],
                "summary": (s.get("summary_te") or s.get("summary") or s.get("excerpt") or "")[:280],
                "category": s.get("category", "indian_markets"),
                "sentiment": s.get("sentiment", "neutral"),
                "importance": s.get("importance", 3),
            }
        )
    return json.dumps({"stories": rows}, ensure_ascii=False)


def _clean_bullets(raw, valid_ids: set[str]) -> list[dict]:
    out = []
    for b in raw or []:
        if not isinstance(b, dict):
            continue
        text = str(b.get("text") or "").strip()
        ids = [i for i in (b.get("ids") or []) if i in valid_ids]
        if text and ids:
            out.append({"text": text, "ids": ids})
    return out


def daily_brief(llm: GroqClient | None, stories: list[dict]) -> dict | None:
    if len(stories) < 2:
        return None
    valid = {s["id"] for s in stories}

    if llm is None:
        # Fallback daily brief in Telugu
        top = stories[:5]
        return {
            "headline": f"{top[0].get('title_te') or top[0]['title']}",
            "bullets": [
                {
                    "text": (s.get("summary_te") or s.get("summary") or s["title"]),
                    "ids": [s["id"]],
                }
                for s in top
            ],
        }

    try:
        reply = llm.chat_json(DAILY_SYSTEM, _story_lines(stories, 25), max_tokens=3000)
    except LLMUnavailableError as exc:
        log.warning("Daily brief skipped with LLM: %s. Using heuristic brief.", exc)
        return daily_brief(None, stories)

    bullets = _clean_bullets(reply.get("bullets"), valid)
    headline = str(reply.get("headline") or "").strip()
    if not bullets and stories:
        return daily_brief(None, stories)
    return {"headline": headline or (stories[0].get("title_te") or stories[0]["title"]), "bullets": bullets}


def weekly_digest(llm: GroqClient | None, stories: list[dict]) -> dict | None:
    if len(stories) < 3:
        return None
    valid = {s["id"] for s in stories}

    if llm is None:
        # Fallback weekly digest in Telugu
        return {
            "overview": "గత వారం భారతీయ మరియు ప్రపంచ స్టాక్ మార్కెట్లలో ముఖ్యమైన ఒడిదుడుకులు మరియు కీలక కార్పొరేట్ పరిణామాలు నమోదయ్యాయి.",
            "sections": [
                {
                    "title": "కీలక మార్కెట్ ముఖ్యాంశాలు",
                    "bullets": [
                        {
                            "text": (s.get("summary_te") or s.get("summary") or s["title"]),
                            "ids": [s["id"]],
                        }
                        for s in stories[:4]
                    ],
                }
            ],
        }

    try:
        reply = llm.chat_json(WEEKLY_SYSTEM, _story_lines(stories, 40), max_tokens=3500)
    except LLMUnavailableError as exc:
        log.warning("Weekly digest skipped with LLM: %s. Using fallback digest.", exc)
        return weekly_digest(None, stories)

    sections = []
    for sec in reply.get("sections") or []:
        if not isinstance(sec, dict):
            continue
        bullets = _clean_bullets(sec.get("bullets"), valid)
        if bullets:
            sections.append({"title": str(sec.get("title") or "").strip(), "bullets": bullets})
    if not sections and stories:
        return weekly_digest(None, stories)
    return {"overview": str(reply.get("overview") or "").strip(), "sections": sections}
