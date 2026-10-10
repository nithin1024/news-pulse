/* Telugu Market Pulse (తెలుగు మార్కెట్ పల్స్) — Static reader for the financial digest
   built by news_bot. Data comes from data/*.json, reading state lives in
   localStorage on this device. */
"use strict";

// ---------------------------------------------------------------- storage
const LS = {
  get(key, fallback) {
    try { const v = localStorage.getItem("pulse." + key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("pulse." + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  },
};

const state = {
  index: null,
  days: new Map(),          // date -> Promise<stories[]>
  read: new Set(LS.get("read", [])),
  saved: new Map(LS.get("saved", [])),
  guideDone: new Set(LS.get("guideDone", [])),
  prevVisit: LS.get("lastVisit", 0),
  focus: -1,
  pageSize: 40,
};

function persistRead() { LS.set("read", [...state.read].slice(-6000)); }
function persistSaved() { LS.set("saved", [...state.saved]); updateSavedCount(); }

// ---------------------------------------------------------------- helpers
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? esc(u) : "#");
const HOUR = 3600e3, DAY = 24 * HOUR;
const ext = 'target="_blank" rel="noopener"';

function ago(iso) {
  if (!iso) return "";
  const t = Date.parse(iso), d = Date.now() - t;
  if (d < 60e3) return "ఇప్పుడే";
  if (d < HOUR) return Math.floor(d / 60e3) + " నిమి. క్రితం";
  if (d < DAY) return Math.floor(d / HOUR) + " గంటల క్రితం";
  if (d < 7 * DAY) return Math.floor(d / DAY) + " రోజుల క్రితం";
  return new Date(t).toLocaleDateString("te-IN", { month: "short", day: "numeric" });
}

const clock = (iso) => new Date(iso).toLocaleTimeString("te-IN", { hour: "2-digit", minute: "2-digit" });

function dayLabel(iso) {
  const d = new Date(iso), today = new Date();
  const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(today) - start(d)) / DAY);
  if (diff === 0) return "ఈరోజు";
  if (diff === 1) return "నిన్న";
  return d.toLocaleDateString("te-IN", { weekday: "long", month: "long", day: "numeric" });
}

function parseDay(iso) {
  if (/^\d{4}-\d{2}$/.test(iso)) return new Date(iso + "-15T12:00:00");
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return new Date(iso + "T12:00:00");
  return new Date(iso);
}

function fmtDate(iso, opts = { month: "short", day: "numeric", year: "numeric" }) {
  if (!iso) return "";
  const d = parseDay(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("te-IN", opts);
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 1800);
}

const catName = (c) => (state.index?.categories || {})[c] || c;
const isNew = (s) => state.prevVisit > 0 && Date.parse(s.seen || s.published) > state.prevVisit;
const plural = (n, word) => `${n.toLocaleString()} ${word}`;

async function getJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(path + " → HTTP " + res.status);
  return res.json();
}

// ---------------------------------------------------------------- data
async function loadIndex() {
  state.index = await getJSON("data/index.json");
  const gen = state.index.generated;
  const ed = $("#edition");
  const stale = Date.now() - Date.parse(gen) > 8 * HOUR;
  ed.textContent = (stale ? "గత ఎడిషన్: " : "తాజా ఎడిషన్: ") + new Date(gen).toLocaleString("te-IN", { weekday: "short", hour: "2-digit", minute: "2-digit" }) + " · " + ago(gen);
  ed.classList.toggle("stale", stale);
  ed.title = stale ? "వార్తల సేకరణ చాలా సమయం నుండి జరగలేదు — GitHub Actions పరిశీలించండి." : "ప్రతి రెండు గంటలకు ఒకసారి తాజా మార్కెట్ వార్తలు సేకరించబడతాయి.";
  const run = state.index.run || {};
  const src = state.index.sources || [];
  $("#colophon-run").textContent = `${src.filter((s) => s.ok).length}/${src.length} అధికారిక మూలాలు యాక్టివ్ · గత రన్లో ${run.new_items ?? 0} తాజా వార్తలు చేరాయి`;
}

function loadDay(date) {
  if (!state.days.has(date)) {
    state.days.set(date, getJSON(`data/days/${date}.json`).catch(() => []));
  }
  return state.days.get(date);
}

async function loadRange(days) {
  const cutoff = Date.now() - days * DAY;
  const cutoffDay = new Date(cutoff - DAY).toISOString().slice(0, 10);
  const dates = (state.index.days || []).map((d) => d.date).filter((d) => d >= cutoffDay);
  const lists = await Promise.all(dates.map(loadDay));
  return lists.flat()
    .filter((s) => Date.parse(s.published) >= cutoff)
    .sort((a, b) => b.published.localeCompare(a.published));
}

const onPage = new Map();
function remember(stories) { for (const s of stories) onPage.set(s.id, s); }

// ---------------------------------------------------------------- financial badges
function sentimentBadge(s) {
  const sent = s.sentiment || "neutral";
  const icon = sent === "positive" ? "🟢" : sent === "negative" ? "🔴" : sent === "mixed" ? "🟣" : "🟡";
  const label = s.sentiment_label_te || (sent === "positive" ? "సానుకూలం" : sent === "negative" ? "ప్రతికూలం" : sent === "mixed" ? "మిశ్రమ ప్రభావం" : "తటస్థం");
  return `<span class="sentiment-badge sent-${esc(sent)}" title="${esc(label)}">${icon} ${esc(label)}</span>`;
}

function priorityBadge(s) {
  const imp = Number(s.importance) || 3;
  const label = s.priority_label_te || (imp >= 4 ? "అత్యంత ముఖ్యమైనది" : imp === 3 ? "ముఖ్యమైనది" : "సాధారణం");
  const cls = imp >= 4 ? "pri-high" : imp === 3 ? "pri-med" : "pri-low";
  return `<span class="priority-badge ${cls}">${esc(label)}</span>`;
}

function stocksTags(s) {
  const stocks = (s.affected_stocks || []).map((stk) => `<a href="#/feed?q=${encodeURIComponent(stk)}" class="stock-pill">${esc(stk)}</a>`).join("");
  const sectors = (s.affected_sectors || []).map((sec) => `<span class="sector-pill">${esc(sec)}</span>`).join("");
  if (!stocks && !sectors) return "";
  return `<div class="stocks-tag">${stocks}${sectors}</div>`;
}

function marketImpactBox(s) {
  if (!s.market_impact_te) return "";
  const sent = s.sentiment || "neutral";
  return `<div class="market-impact-dek sent-${esc(sent)}"><b>మార్కెట్ ప్రభావ విశ్లేషణ:</b> ${esc(s.market_impact_te)}</div>`;
}

function meter(n) {
  return `<span class="meter" title="ప్రాధాన్యత ${n} / 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
}

function kicker(s, { time = true } = {}) {
  const parts = [];
  parts.push(priorityBadge(s));
  parts.push(sentimentBadge(s));
  if (!state.read.has(s.id) && isNew(s)) parts.push('<span class="fresh">తాజాది</span>');
  parts.push(`<span class="cat cat-${esc(s.category)}">${esc(catName(s.category))}</span>`);
  parts.push(`<span class="src">${esc(s.source_name)}${s.also?.length ? ` +${s.also.length}` : ""}</span>`);
  if (time) parts.push(`<time datetime="${esc(s.published)}" title="${esc(new Date(s.published).toLocaleString('te-IN'))}">${ago(s.published)}</time>`);
  parts.push(meter(s.importance));
  return `<div class="kicker">${parts.join("")}</div>`;
}

function headline(s, tag = "h3") {
  const title = s.title_te || s.title;
  return `<${tag} class="hl"><a href="${safeUrl(s.url)}" ${ext} data-open="${esc(s.id)}">${esc(title)}</a></${tag}>`;
}

function body(s, { why = true } = {}) {
  const summary = s.summary_te || s.summary || s.excerpt || "";
  const whyText = s.why_it_matters_te || s.why || "";
  const text = summary ? `<p class="dek">${esc(summary)}</p>` : "";
  const whyBlock = (why && whyText) ? `<p class="why"><b>మార్కెట్కు ఎందుకు ముఖ్యం:</b> ${esc(whyText)}</p>` : "";
  const impact = marketImpactBox(s);
  const pills = stocksTags(s);
  return text + whyBlock + impact + pills;
}

function also(s) {
  if (!s.also?.length) return "";
  return `<details class="also"><summary>ఇతర మూలాలు: ${esc(s.also.map((a) => a.source_name).slice(0, 3).join(", "))}${s.also.length > 3 ? ` మరియు మరో ${s.also.length - 3}` : ""}</summary><ul>${
    s.also.map((a) => `<li><a href="${safeUrl(a.url)}" ${ext} data-open="${esc(s.id)}">${esc(a.source_name)}</a> — ${esc(a.title)}</li>`).join("")
  }</ul></details>`;
}

function tools(s) {
  const saved = state.saved.has(s.id), read = state.read.has(s.id);
  const tags = (s.tags || []).map((t) => `<button class="tag" data-tag="${esc(t)}">${esc(t)}</button>`).join("");
  return `<div class="tools"><div class="tags">${tags}</div><div class="acts">
    <button class="act ${saved ? "on" : ""}" data-act="save" aria-pressed="${saved}" title="సేవ్ చేయండి (s)">${saved ? "★ సేవ్ చేయబడింది" : "☆ సేవ్ చేయి"}</button>
    <button class="act" data-act="read" title="చదివినట్లు గుర్తించు (m)">${read ? "చదవనిదిగా మార్చు" : "చదివినట్లు గుర్తించు"}</button></div></div>`;
}

const cls = (s, extra = "") => `story imp-${Number(s.importance) || 2} ${state.read.has(s.id) ? "read" : ""} ${extra}`;

function leadStory(s) {
  return `<article class="${cls(s, "lead")}" data-id="${esc(s.id)}">${kicker(s)}${headline(s, "h2")}${body(s)}${also(s)}${tools(s)}</article>`;
}
function colStory(s, i) {
  return `<article class="${cls(s, i < 3 && s.importance >= 4 ? "big" : "")}" data-id="${esc(s.id)}" style="--i:${i}">${kicker(s)}${headline(s)}${body(s, { why: i < 3 })}${also(s)}${tools(s)}</article>`;
}
function rowStory(s, i) {
  return `<article class="${cls(s, "row")}" data-id="${esc(s.id)}" style="--i:${Math.min(i, 12)}">
    <div class="stamp"><b>${clock(s.published)}</b>${ago(s.published)}</div>
    <div>${kicker(s, { time: false })}${headline(s)}${body(s)}${also(s)}${tools(s)}</div></article>`;
}

function river(stories, { group = false, limit = Infinity } = {}) {
  if (!stories.length) return "";
  const shown = stories.slice(0, limit);
  if (!group) return `<div class="river reveal">${shown.map(rowStory).join("")}</div>`;
  const counts = {};
  for (const s of stories) { const l = dayLabel(s.published); counts[l] = (counts[l] || 0) + 1; }
  let html = "", last = "";
  shown.forEach((s, i) => {
    const label = dayLabel(s.published);
    if (label !== last) { html += `<div class="day-head"><h3>${esc(label)}</h3><span>${plural(counts[label], "వార్తలు")}</span></div>`; last = label; }
    html += rowStory(s, i);
  });
  return `<div class="river reveal">${html}</div>`;
}

// ---------------------------------------------------------------- market overview bar
function marketOverviewBar(pulse) {
  if (!pulse) return "";
  const indices = pulse.indices || [];
  if (!indices.length) return "";
  const cards = indices.map((idx) => {
    const isUp = (idx.change || 0) >= 0;
    const sign = isUp ? "+" : "";
    const chgCls = isUp ? "up" : "down";
    return `<div class="market-card">
      <div class="name"><span>${esc(idx.name)}</span><small>${esc(idx.exchange || "")}</small></div>
      <div class="val">${idx.price ? Number(idx.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}</div>
      <div class="chg ${chgCls}">${sign}${idx.change ?? 0} (${sign}${idx.pct_change ?? 0}%)</div>
    </div>`;
  }).join("");
  return `<div class="market-bar">${cards}</div>`;
}

function disclaimerBox() {
  return `<div class="disclaimer-box">
    <b>ముఖ్య గమనిక:</b> ఈ వెబ్సైట్లోని వార్తల విశ్లేషణ, మార్కెట్ ప్రభావాలు మరియు సారాంశాలు కేవలం సమాచార మరియు విద్యా ప్రయోజనాల కోసం మాత్రమే. ఇది ఎలాంటి ప్రత్యక్ష బై/సెల్ ట్రేడింగ్ సిఫార్సు లేదా ఆర్థిక సలహా కాదు. పెట్టుబడులు పెట్టే ముందు మీ సెబీ రిజిస్టర్డ్ ఆర్థిక సలహాదారుని సంప్రదించండి.
  </div>`;
}

// ---------------------------------------------------------------- routing
function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, query = ""] = raw.split("?");
  return { route: path || "today", params: Object.fromEntries(new URLSearchParams(query)) };
}

function setParams(params) {
  const { route } = parseHash();
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null));
  const q = new URLSearchParams(clean).toString();
  history.replaceState(null, "", `#/${route}${q ? "?" + q : ""}`);
  render({ keepScroll: true });
}

const VIEWS = {};
let renderSeq = 0;
let lastRoute = null;

async function render({ keepScroll = false } = {}) {
  const { route, params } = parseHash();
  const seq = ++renderSeq;
  if (!keepScroll) togglePaletteMenu(false);
  $$("#nav .section-links a").forEach((a) => a.classList.toggle("active", a.dataset.route === route));
  const view = $("#view");
  const fn = VIEWS[route] || VIEWS.today;
  let html;
  try {
    html = await fn(params);
  } catch (err) {
    console.error(err);
    html = `<div class="empty">ఈ పేజీని లోడ్ చేయడం సాధ్యం కాలేదు: ${esc(err.message)}</div>`;
  }
  if (seq !== renderSeq) return;
  const routeChanged = route !== lastRoute;
  lastRoute = route;
  const swap = () => {
    view.innerHTML = html;
    state.focus = -1;
    if (routeChanged && !keepScroll) {
      const nav = $("#nav");
      const top = nav.offsetTop;
      if (scrollY > top) scrollTo({ top, behavior: "instant" });
    }
  };
  if (routeChanged && document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(swap);
  } else swap();
}

// ---------------------------------------------------------------- front page (ఈరోజు వార్తలు)
VIEWS.today = async () => {
  const idx = state.index;
  const week = await loadRange(7);
  remember(week);
  const now = Date.now();
  let day = week.filter((s) => now - Date.parse(s.published) < DAY);
  if (day.length < 8) day = week.filter((s) => now - Date.parse(s.published) < 2 * DAY);
  const ranked = [...day].sort((a, b) => b.score - a.score);
  const lead = ranked.find((s) => s.summary && s.importance >= 4) || ranked[0];
  if (!lead) return '<div class="empty">తాజా వార్తలను సేకరిస్తున్నాము — కాసేపట్లో అందుబాటులోకి వస్తాయి.</div>';
  const used = new Set([lead.id]);
  const pick = (n) => {
    const out = ranked.filter((s) => !used.has(s.id)).slice(0, n);
    out.forEach((s) => used.add(s.id));
    return out;
  };
  const subs = pick(2);
  const cols = pick(9);

  const unread = week.filter((s) => s.importance >= 4 && !state.read.has(s.id) && !used.has(s.id))
    .sort((a, b) => b.score - a.score).slice(0, 6);
  const fresh = week.filter((s) => isNew(s) && !state.read.has(s.id));

  const notice = fresh.length
    ? `<div class="notice"><span>మీ చివరి విజిట్ తర్వాత <b>${plural(fresh.length, "తాజా వార్తలు")}</b> చేరాయి.</span><a href="#/feed?new=1&sort=top&range=7">వాటిని మాత్రమే చూడండి →</a></div>`
    : "";

  const bar = marketOverviewBar(idx.market_pulse);

  return `${bar}${notice}
  <section class="front reveal">
    <div class="lead-col">${leadStory(lead)}${subs.length ? `<div class="sublead">${subs.map((s, i) => colStory(s, i + 1)).join("")}</div>` : ""}</div>
    ${briefing(idx.brief, ranked)}
  </section>
  <section class="columns reveal">${cols.map(colStory).join("")}</section>
  
  <div class="desks reveal">
    <section class="desk" style="--i:1">
      <div class="sect-head"><h2>FII / DII <em>సంగ్రహం</em></h2><a href="#/fii_dii">పూర్తి డాష్బోర్డ్</a></div>
      ${fiiMiniDesk(idx.market_pulse?.fii_dii)}
    </section>
    <section class="desk" style="--i:2">
      <div class="sect-head"><h2>కమోడిటీలు &amp; <em>కరెన్సీ</em></h2><a href="#/commodities">పూర్తి వివరాలు</a></div>
      ${commoditiesMiniDesk(idx.market_pulse?.commodities_forex)}
    </section>
    <section class="desk" style="--i:3">
      <div class="sect-head"><h2>ఆర్థిక <em>క్యాలెండర్</em></h2><a href="#/calendar">పూర్తి షెడ్యూల్</a></div>
      ${calMiniList(idx.market_pulse?.economic_calendar || idx.conferences)}
    </section>
  </div>

  ${unread.length ? `<div class="sect-head"><h2>ఈ వారం మీరు చదవని <em>ముఖ్యమైన వార్తలు</em></h2><a href="#/feed?range=7&level=4&hideRead=1&sort=top">అన్ని ముఖ్యాంశాలు</a></div>${river(unread)}` : ""}
  ${idx.weekly ? `<div class="sect-head"><h2>వారపు మార్కెట్ <em>సమీక్ష (Weekly Digest)</em></h2><a href="#/briefs?kind=weekly">గత వారాల సమీక్షలు</a></div>${issue(idx.weekly)}` : ""}
  ${disclaimerBox()}
  <div class="status-line"><span>షార్ట్కట్లు: <kbd>j</kbd> <kbd>k</kbd> తరలించు · <kbd>o</kbd> ఓపెన్ · <kbd>m</kbd> రీడ్ · <kbd>s</kbd> సేవ్ · <kbd>/</kbd> శోధించు</span><a href="#/sources">మూలాల స్థితి</a></div>`;
};

function briefRefs(ids, refs) {
  const seen = new Set();
  const links = [];
  for (const id of ids) {
    const story = onPage.get(id);
    const r = story ? { url: story.url, source: story.source_name, title: story.title_te || story.title } : refs?.[id];
    if (!r || seen.has(r.source) || links.length >= 3) continue;
    seen.add(r.source);
    links.push(`<a href="${safeUrl(r.url)}" ${ext} title="${esc(r.title)}" data-open="${esc(id)}">${esc(r.source)}↗</a>`);
  }
  return links.join(" ");
}

function briefing(b, ranked) {
  if (b?.bullets?.length) {
    return `<aside class="briefing" style="--i:1"><h2>డైలీ బ్రీఫింగ్ (The Briefing)</h2><div class="when">${ago(b.generated)} నాటి మార్కెట్ సారాంశం</div>
      ${b.headline ? `<p class="headline">${esc(b.headline)}</p>` : ""}
      <ol class="brief-list">${b.bullets.map((x) => `<li>${esc(x.text)}<span class="refs">${briefRefs(x.ids, b.refs)}</span></li>`).join("")}</ol></aside>`;
  }
  const top = [...ranked].slice(0, 5);
  return `<aside class="briefing" style="--i:1"><h2>నేటి మార్కెట్ ముఖ్యాంశాలు</h2><div class="when">తాజా పరిణామాలు</div>
    <ol class="brief-list">${top.map((s) => `<li><a href="${safeUrl(s.url)}" ${ext} data-open="${esc(s.id)}" style="text-decoration:none">${esc(s.title_te || s.title)}</a></li>`).join("") || "<li>ప్రస్తుతం మార్కెట్ ప్రశాంతంగా ఉంది.</li>"}</ol></aside>`;
}

function fiiMiniDesk(fiiData) {
  if (!fiiData) return '<p class="empty">FII/DII డేటా లోడ్ అవుతోంది…</p>';
  const fNet = fiiData.fii?.net || 0;
  const dNet = fiiData.dii?.net || 0;
  const fCls = fNet >= 0 ? "net-buy" : "net-sell";
  const dCls = dNet >= 0 ? "net-buy" : "net-sell";
  return `<div style="font-size:13.5px;padding-top:4px;">
    <div style="margin-bottom:8px;"><b>తేదీ:</b> ${esc(fiiData.date)}</div>
    <div style="display:flex;justify-content:space-between;margin:6px 0;"><span>FII నికర:</span><b class="${fCls}" style="font-family:var(--mono)">${fNet >= 0 ? "+" : ""}${fNet.toLocaleString()} కోట్లు</b></div>
    <div style="display:flex;justify-content:space-between;margin:6px 0;"><span>DII నికర:</span><b class="${dCls}" style="font-family:var(--mono)">${dNet >= 0 ? "+" : ""}${dNet.toLocaleString()} కోట్లు</b></div>
    <p style="font-size:12.5px;color:var(--ink-2);margin:10px 0 0;line-height:1.45;">${esc((fiiData.market_impact_te || "").slice(0, 160))}…</p>
  </div>`;
}

function commoditiesMiniDesk(items) {
  if (!items?.length) return '<p class="empty">కమోడిటీ రేట్లు అందుబాటులో లేవు.</p>';
  return `<ul class="cal">${items.slice(0, 4).map((c) => {
    const isUp = (c.change || 0) >= 0;
    const sign = isUp ? "+" : "";
    return `<li><div class="d"><small>${esc(c.category)}</small>${isUp ? "▲" : "▼"}</div>
      <div><b>${esc(c.name)}</b>: <span style="font-family:var(--mono)">${c.price ?? "—"} ${esc(c.unit)}</span>
      <span class="sub" style="color:${isUp ? 'var(--sentiment-positive)' : 'var(--sentiment-negative)'}">${sign}${c.change ?? 0} (${sign}${c.pct_change ?? 0}%)</span></div></li>`;
  }).join("")}</ul>`;
}

function calMiniList(events) {
  if (!events?.length) return '<p class="empty">షెడ్యూల్డ్ ఈవెంట్లు లేవు.</p>';
  return `<ul class="cal">${events.slice(0, 4).map((c) => {
    const d = c.date ? parseDay(c.date) : (c.start ? parseDay(c.start) : null);
    return `<li><div class="d"><small>${d ? d.toLocaleDateString("te-IN", { month: "short" }) : "త్వరలో"}</small>${d ? d.getDate() : "—"}</div>
      <div><a href="${safeUrl(c.url)}" ${ext}>${esc(c.event || c.name)}</a><span class="sub">${esc(c.time_ist || c.dates || "")} · ${esc(c.country || "")}</span></div></li>`;
  }).join("")}</ul>`;
}

function issue(b, stampHtml = "") {
  const bullets = (list) => `<ol class="brief-list">${list.map((x) => `<li>${esc(x.text)}<span class="refs">${briefRefs(x.ids, b.refs)}</span></li>`).join("")}</ol>`;
  const content = b.bullets
    ? `${b.headline ? `<p class="headline">${esc(b.headline)}</p>` : ""}${bullets(b.bullets)}`
    : `${b.overview ? `<p class="overview">${esc(b.overview)}</p>` : ""}${(b.sections || []).map((s) => `<h4>${esc(s.title)}</h4>${bullets(s.bullets)}`).join("")}`;
  return stampHtml ? `<article class="issue">${stampHtml}<div>${content}</div></article>` : `<div class="reveal"><div>${content}</div></div>`;
}

// ---------------------------------------------------------------- list & feed views
const RANGES = [["1", "24 గంటలు"], ["3", "3 రోజులు"], ["7", "7 రోజులు"], ["30", "30 రోజులు"], ["60", "60 రోజులు"]];
const LEVELS = [["2", "అన్నీ"], ["3", "ముఖ్యమైనవి"], ["4", "అత్యంత ముఖ్యమైనవి"]];
const SENTIMENTS = [["", "అన్ని ప్రభావాలు"], ["positive", "🟢 సానుకూలం"], ["negative", "🔴 ప్రతికూలం"], ["neutral", "🟡 తటస్థం"], ["mixed", "🟣 మిశ్రమ ప్రభావం"]];

function seg(name, label, options, current) {
  return `<div class="seg" role="group" aria-label="${esc(label)}"><span class="seg-label">${esc(label)}</span>${options.map(([v, text]) =>
    `<button data-param="${name}" data-value="${v}" aria-pressed="${String(v) === String(current)}">${text}</button>`).join("")}</div>`;
}

function matches(s, terms) {
  if (!terms.length) return true;
  const hay = [
    s.title, s.title_te, s.summary, s.summary_te, s.why, s.why_it_matters_te, s.excerpt,
    s.source_name, (s.affected_stocks || []).join(" "), (s.affected_sectors || []).join(" "),
    (s.tags || []).join(" "), s.market_impact_te,
    (s.also || []).map((a) => a.source_name + " " + a.title).join(" ")
  ].join(" ").toLowerCase();
  return terms.every((t) => hay.includes(t));
}

async function genericFeedView(params, opts = {}) {
  const p = { range: opts.range || "7", sort: opts.sort || "latest", level: "2", ...params };
  const q = (p.q || "").trim();
  const range = q ? 60 : Math.min(Number(p.range) || 7, 60);
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const all = await loadRange(range);

  let rows = all.filter((s) => (opts.filter ? opts.filter(s) : true));
  if (p.cat) rows = rows.filter((s) => s.category === p.cat);
  if (p.sent) rows = rows.filter((s) => s.sentiment === p.sent);
  rows = rows.filter((s) => (s.importance || 2) >= Number(p.level || 2));
  if (p.hideRead === "1") rows = rows.filter((s) => !state.read.has(s.id));
  if (p.new === "1") rows = rows.filter(isNew);
  rows = rows.filter((s) => matches(s, terms));
  if (p.sort === "top") rows.sort((a, b) => b.score - a.score);
  remember(rows);

  const limit = Number(p.limit) || state.pageSize;
  const cats = Object.entries(state.index?.categories || {});
  const catRow = opts.hideCategories ? "" : `<div class="cats">
      <button class="cat-btn" data-param="cat" data-value="" aria-pressed="${!p.cat}">అన్ని రంగాలు</button>
      ${cats.map(([k, v]) => `<button class="cat-btn cat-${k}" data-param="cat" data-value="${k}" aria-pressed="${p.cat === k}"><span class="dot"></span>${esc(v)}</button>`).join("")}
    </div>`;

  return `${q ? `<div class="notice"><span>గత 60 రోజులలో <b>“${esc(q)}”</b> కోసం శోధించిన ఫలితాలు</span><a href="#" data-clear-search>ఫిల్టర్ తీసివేయి ✕</a></div>` : ""}
    <div class="filters">${catRow}
      ${q ? "" : seg("range", "సమయం", RANGES, String(range))}
      ${seg("sent", "ప్రభావం", SENTIMENTS, p.sent || "")}
      ${seg("sort", "క్రమం", [["latest", "తాజావి"], ["top", "టాప్ స్కోర్"]], p.sort)}
      ${seg("level", "ప్రాధాన్యత", LEVELS, p.level || "2")}
      <label class="chk"><input type="checkbox" data-param="hideRead" ${p.hideRead === "1" ? "checked" : ""}> చదివినవి దాచు</label>
      ${p.new === "1" ? `<button class="link-btn" data-param="new" data-value="">తాజావి మాత్రమే ✕</button>` : ""}
      <button class="link-btn" data-mark-all>వీటన్నింటిని చదివినట్లు గుర్తించు</button>
      <span class="tally">${plural(rows.length, "వార్తలు")}</span>
    </div>
    ${river(rows, { group: p.sort !== "top", limit }) || `<div class="empty">${opts.empty || "ఈ ఫిల్టర్లకు సరిపోయే వార్తలు లేవు."}</div>`}
    ${rows.length > limit ? `<div class="more"><button class="big-btn" data-param="limit" data-value="${limit + state.pageSize * 2}">మరిన్ని వార్తలు చూడండి · మరో ${rows.length - limit} మిగిలి ఉన్నాయి</button></div>` : ""}`;
}

const head = (title, sub, aside = "") =>
  `<header class="page-head"><h1>${title}</h1><span class="count">${aside}</span>${sub ? `<p>${sub}</p>` : ""}</header>`;

// ---------------------------------------------------------------- specific sections
VIEWS.feed = async (params) =>
  head("అన్ని మార్కెట్ వార్తలు", "భారతీయ మరియు ప్రపంచ స్టాక్ మార్కెట్లకు సంబంధించిన అన్ని వార్తలు, సారాంశాలు మరియు ప్రభావ విశ్లేషణ.") +
  await genericFeedView(params);

VIEWS.indian_markets = async (params) =>
  head("భారతీయ మార్కెట్ వార్తలు", "NIFTY 50, BANKNIFTY, SENSEX, రంగాల వారీ ర్యాలీలు, పతనాలు మరియు దేశీయ మార్కెట్ పరిణామాలు.") +
  await genericFeedView(params, { filter: (s) => s.category === "indian_markets", hideCategories: true });

VIEWS.stocks_in_news = async (params) =>
  head("Stocks in News", "కీలక వార్తలు కలిగిన కంపెనీలు, షేర్ల కదలికలు, కార్పొరేట్ ప్రకటనలు మరియు స్వల్పకాలిక/దీర్ఘకాలిక ప్రభావం.") +
  await genericFeedView(params, { filter: (s) => s.category === "stocks_in_news" || (s.affected_stocks?.length > 0), hideCategories: true });

VIEWS.global_markets = async (params) =>
  head("ప్రపంచ Stock Market వార్తలు", "అమెరికా, యూరప్, ఆసియా మార్కెట్లు, యూఎస్ ఫెడరల్ రిజర్వ్ నిర్ణయాలు, బాండ్ ఈల్డ్స్ మరియు భారత మార్కెట్పై వాటి ప్రభావం.") +
  await genericFeedView(params, { filter: (s) => s.category === "global_markets", hideCategories: true });

VIEWS.earnings = async (params) =>
  head("ఫలితాలు &amp; కార్పొరేట్ చర్యలు (Earnings & Corporate Actions)", "త్రైమాసిక ఫలితాలు (Q1/Q2/Q3/Q4), డివిడెండ్లు, బోనస్ షేర్లు, బైబ్యాక్లు, మెర్జర్లు మరియు పెద్ద ఆర్డర్ విన్స్.") +
  await genericFeedView(params, { filter: (s) => s.category === "earnings", hideCategories: true });

VIEWS.ipo = async (params) =>
  head("IPO వార్తలు (Initial Public Offerings)", "కొత్త IPO ప్రకటనలు, ప్రైస్ బ్యాండ్లు, సబ్స్క్రిప్షన్ స్టేటస్ మరియు స్టాక్ ఎక్స్ఛేంజ్లలో లిస్టింగ్ వివరాలు.") +
  await genericFeedView(params, { filter: (s) => s.category === "ipo", hideCategories: true });

// ---------------------------------------------------------------- FII / DII Dashboard
VIEWS.fii_dii = async () => {
  const pulse = state.index?.market_pulse || {};
  const fii = pulse.fii_dii || {};
  const fiiObj = fii.fii || {};
  const diiObj = fii.dii || {};

  const fNet = fiiObj.net || 0;
  const dNet = diiObj.net || 0;

  const trendRows = (fii.trend_sessions || []).map((row) => `
    <tr>
      <td><b>${esc(row.date)}</b></td>
      <td class="mono ${row.fii_net >= 0 ? 'good' : 'bad'}">${row.fii_net >= 0 ? '+' : ''}${row.fii_net.toLocaleString()}</td>
      <td class="mono ${row.dii_net >= 0 ? 'good' : 'bad'}">${row.dii_net >= 0 ? '+' : ''}${row.dii_net.toLocaleString()}</td>
      <td class="mono">${esc(row.nifty_chg)}</td>
    </tr>`).join("");

  const week = await loadRange(14);
  const relatedStories = week.filter((s) => s.category === "fii_dii" || matches(s, ["fii", "dii", "foreign"]));

  return head("FII / DII డ్యాష్బోర్డ్", "విదేశీ సంస్థాగత పెట్టుబడిదారులు (FIIs) మరియు దేశీయ సంస్థాగత పెట్టుబడిదారుల (DIIs) కొనుగోళ్లు, అమ్మకాలు మరియు మార్కెట్ ప్రభావం.", `తేదీ: ${esc(fii.date || "తాజాది")}`) +
    `<div class="fii-dii-grid reveal">
      <div class="fii-card">
        <h3>FII / FPI (విదేశీ సంస్థాగత పెట్టుబడిదారులు)</h3>
        <div class="fii-stat-row"><span class="lbl">కొనుగోళ్లు (Buy):</span><span class="val">₹ ${fiiObj.buy?.toLocaleString() ?? 0} కోట్లు</span></div>
        <div class="fii-stat-row"><span class="lbl">అమ్మకాలు (Sell):</span><span class="val">₹ ${fiiObj.sell?.toLocaleString() ?? 0} కోట్లు</span></div>
        <div class="fii-stat-row"><span class="lbl">నికర విలువ (Net):</span><span class="val ${fNet >= 0 ? 'net-buy' : 'net-sell'}">₹ ${fNet >= 0 ? '+' : ''}${fNet.toLocaleString()} కోట్లు</span></div>
        <div class="fii-stat-row"><span class="lbl">స్థితి:</span><span class="badge-priority ${fNet >= 0 ? 'pri-high' : 'pri-low'}">${esc(fiiObj.status_te || "")}</span></div>
      </div>

      <div class="fii-card">
        <h3>DII (దేశీయ సంస్థాగత పెట్టుబడిదారులు - MF, LIC)</h3>
        <div class="fii-stat-row"><span class="lbl">కొనుగోళ్లు (Buy):</span><span class="val">₹ ${diiObj.buy?.toLocaleString() ?? 0} కోట్లు</span></div>
        <div class="fii-stat-row"><span class="lbl">అమ్మకాలు (Sell):</span><span class="val">₹ ${diiObj.sell?.toLocaleString() ?? 0} కోట్లు</span></div>
        <div class="fii-stat-row"><span class="lbl">నికర విలువ (Net):</span><span class="val ${dNet >= 0 ? 'net-buy' : 'net-sell'}">₹ ${dNet >= 0 ? '+' : ''}${dNet.toLocaleString()} కోట్లు</span></div>
        <div class="fii-stat-row"><span class="lbl">స్థితి:</span><span class="badge-priority ${dNet >= 0 ? 'pri-high' : 'pri-low'}">${esc(diiObj.status_te || "")}</span></div>
      </div>
    </div>

    <div class="analysis-card reveal">
      <h4>మార్కెట్ ప్రభావ సమగ్ర విశ్లేషణ:</h4>
      <p>${esc(fii.market_impact_te || "")}</p>
      <p style="margin-top:8px;font-size:13.5px;color:var(--ink-2);"><b>డెరివేటివ్స్ (F&amp;O) గమనిక:</b> ${esc(fii.derivatives_note_te || "")}</p>
    </div>

    <div class="sect-head"><h2>గత 5 ట్రేడింగ్ సెషన్ల <em>ధోరణి (Trend)</em></h2></div>
    <div class="news-table-wrap reveal">
      <table class="news-table">
        <thead><tr><th>తేదీ</th><th>FII నికర (కోట్లలో)</th><th>DII నికర (కోట్లలో)</th><th>NIFTY 50 మార్పు</th></tr></thead>
        <tbody>${trendRows}</tbody>
      </table>
    </div>

    <div class="sect-head" style="margin-top:30px"><h2>FII / DII ప్రవాహాలకు సంబంధించిన <em>తాజా వార్తలు</em></h2></div>
    ${river(relatedStories, { limit: 15 }) || '<p class="empty">ప్రస్తుతం ప్రత్యేక FII వార్తలు లేవు.</p>'}`;
};

// ---------------------------------------------------------------- Commodities & Forex
VIEWS.commodities = async () => {
  const pulse = state.index?.market_pulse || {};
  const list = pulse.commodities_forex || [];

  const cards = list.map((c) => {
    const isUp = (c.change || 0) >= 0;
    const sign = isUp ? "+" : "";
    const color = isUp ? "var(--sentiment-positive)" : "var(--sentiment-negative)";
    return `<div class="com-card">
      <div class="com-head">
        <h3 class="com-title">${esc(c.name)}</h3>
        <span class="com-cat">${esc(c.category)}</span>
      </div>
      <div class="com-price">${c.price ? Number(c.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"} <small style="font-size:13px;color:var(--ink-3)">${esc(c.unit)}</small></div>
      <div style="font:600 13px var(--mono);color:${color};margin-bottom:12px;">${sign}${c.change ?? 0} (${sign}${c.pct_change ?? 0}%)</div>
      <div class="com-impact">
        <b>భారత మార్కెట్పై సాధ్యమైన ప్రభావం:</b>
        ${esc(c.impact_te)}
      </div>
    </div>`;
  }).join("");

  const week = await loadRange(14);
  const relatedStories = week.filter((s) => s.category === "commodities_forex" || matches(s, ["crude", "oil", "gold", "silver", "dollar", "rupee", "yield", "bond"]));

  return head("Crude Oil, Gold, Currency &amp; Bonds", "ముడి చమురు, బంగారం, వెండి, రూపాయి, డాలర్ ఇండెక్స్ మరియు బాండ్ ఈల్డ్స్ ప్రత్యక్ష ధరలు మరియు భారతీయ స్టాక్ మార్కెట్పై వాటి ప్రభావ విశ్లేషణ.") +
    `<div class="com-grid reveal">${cards || '<p class="empty">కమోడిటీ డేటా లోడ్ అవుతోంది…</p>'}</div>
    <div class="sect-head" style="margin-top:30px"><h2>కమోడిటీలు &amp; కరెన్సీకి సంబంధించిన <em>తాజా వార్తలు</em></h2></div>
    ${river(relatedStories, { limit: 15 }) || '<p class="empty">ప్రస్తుతం సంబంధిత వార్తలు లేవు.</p>'}`;
};

// ---------------------------------------------------------------- Economic Calendar
VIEWS.calendar = async () => {
  const pulse = state.index?.market_pulse || {};
  const events = pulse.economic_calendar || state.index?.conferences || [];

  const cards = events.map((ev) => {
    return `<div class="cal-card">
      <div class="cal-date-row">
        <span>${esc(ev.time_ist || ev.dates || "సమయం ఖరారు కావాలి")}</span>
        <span class="badge-priority pri-high">${esc(ev.importance || "ముఖ్యమైనది")}</span>
      </div>
      <h3>${esc(ev.event || ev.name)}</h3>
      <div style="font:500 12px var(--sans);color:var(--ink-2);margin-bottom:8px;"><b>దేశం / మూలం:</b> ${esc(ev.country || "")} · ${esc(ev.source || ev.location || "")}</div>
      <div class="note"><b>మార్కెట్పై ప్రభావం:</b> ${esc(ev.impact_te || ev.note || "మార్కెట్ ఒడిదుడుకులకు దారితీసే అవకాశం ఉంది.")}</div>
    </div>`;
  }).join("");

  const week = await loadRange(14);
  const ecoStories = week.filter((s) => s.category === "economy" || matches(s, ["rbi", "inflation", "cpi", "gdp", "fed", "policy"]));

  return head("ఆర్థిక క్యాలెండర్ (Economic Calendar)", "భారతీయ మరియు ప్రపంచ స్టాక్ మార్కెట్లను ప్రభావితం చేసే కీలక ఆర్థిక సంఘటనలు (సమయాలు IST లో).") +
    `<div class="cal-grid reveal">${cards || '<p class="empty">క్యాలెండర్ డేటా అందుబాటులో లేదు.</p>'}</div>
    <div class="sect-head" style="margin-top:30px"><h2>ఆర్థిక విధానాలు &amp; స్థూల డేటా <em>వార్తలు</em></h2></div>
    ${river(ecoStories, { limit: 15 }) || '<p class="empty">ప్రస్తుతం వార్తలు లేవు.</p>'}`;
};

// ---------------------------------------------------------------- News Table View (వార్తల పట్టిక)
VIEWS.table = async (params) => {
  const p = { range: "7", sort: "latest", ...params };
  const all = await loadRange(Number(p.range) || 7);
  const q = (p.q || "").trim();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);

  let rows = all.filter((s) => matches(s, terms));
  if (p.cat) rows = rows.filter((s) => s.category === p.cat);
  if (p.sent) rows = rows.filter((s) => s.sentiment === p.sent);
  if (p.level) rows = rows.filter((s) => (s.importance || 2) >= Number(p.level));
  remember(rows);

  const tableRows = rows.slice(0, 60).map((s) => {
    const stockPills = (s.affected_stocks || []).map((stk) => `<span class="stock-pill">${esc(stk)}</span>`).join(" ");
    const secPills = (s.affected_sectors || []).map((sec) => `<span class="sector-pill">${esc(sec)}</span>`).join(" ");
    const entity = stockPills || secPills || `<span style="color:var(--ink-3)">${esc(catName(s.category))}</span>`;

    return `<tr>
      <td class="col-pri">${priorityBadge(s)}</td>
      <td class="col-stock">${entity}</td>
      <td class="col-title"><a href="${safeUrl(s.url)}" ${ext} data-open="${esc(s.id)}">${esc(s.title_te || s.title)}</a></td>
      <td class="col-impact">${sentimentBadge(s)}</td>
      <td class="col-reason">${esc(s.market_impact_te || s.why_it_matters_te || s.why || "మార్కెట్ సెంటిమెంట్పై ప్రభావం.")}</td>
      <td class="col-time">${ago(s.published)}</td>
      <td class="col-source">${esc(s.source_name)}</td>
    </tr>`;
  }).join("");

  return head("మార్కెట్ వార్తల పట్టిక", "ప్రాధాన్యత, కంపెనీ/రంగం, ప్రభావం మరియు కారణంతో కూడిన పూర్తి వివరాల పట్టిక.") +
    `<div class="filters">
      ${seg("sent", "ప్రభావం", SENTIMENTS, p.sent || "")}
      ${seg("range", "సమయం", RANGES, p.range || "7")}
      ${seg("level", "ప్రాధాన్యత", LEVELS, p.level || "2")}
      <span class="tally">${plural(rows.length, "వార్తలు")}</span>
    </div>
    <div class="news-table-wrap reveal">
      <table class="news-table">
        <thead>
          <tr>
            <th>ప్రాధాన్యత</th>
            <th>కంపెనీ / రంగం</th>
            <th>వార్త శీర్షిక</th>
            <th>ప్రభావం</th>
            <th>ప్రభావానికి కారణం</th>
            <th>సమయం</th>
            <th>మూలం</th>
          </tr>
        </thead>
        <tbody>${tableRows || '<tr><td colspan="7" style="text-align:center;padding:30px;">ఫిల్టర్లకు సరిపోయే వార్తలు లేవు.</td></tr>'}</tbody>
      </table>
    </div>`;
};

// ---------------------------------------------------------------- Guide & Glossary
let guideData = null;
VIEWS.guide = async () => {
  guideData = guideData || await getJSON("data/guide.json").catch(() => getJSON("data/catchup.json").catch(() => null));
  const c = guideData;
  if (!c) return '<div class="empty">మార్కెట్ గైడ్ అందుబాటులో లేదు.</div>';

  const chapters = (c.sections || []).map((s, n) => `<section class="chapter" id="guide-${esc(s.id)}">
      <div class="chapter-head"><div class="no">${String(n + 1).padStart(2, "0")}</div><div><h2>${esc(s.title)}</h2>${s.intro ? `<p>${esc(s.intro)}</p>` : ""}</div></div>
      <ol class="entries">${(s.items || []).map((it) => {
        return `<li class="entry">
          <div class="when">${esc(it.title)}</div>
          <div><p class="what">${esc(it.what)}</p>${it.why_it_matters ? `<p class="why"><b>ఎందుకు ముఖ్యం:</b> ${esc(it.why_it_matters)}</p>` : ""}</div>
        </li>`;
      }).join("")}</ol></section>`).join("");

  const glossary = c.glossary?.length ? `<section class="chapter" id="guide-glossary">
      <div class="chapter-head"><div class="no">అ-ఱ</div><div><h2>స్టాక్ మార్కెట్ సాంకేతిక పదకోశం (Glossary)</h2><p>మార్కెట్ విశ్లేషణలలో కనిపించే కీలక పదాల సరళమైన వివరణ.</p></div></div>
      <div class="glossary">${c.glossary.map((g) => `<div><b>${esc(g.term)}</b><span>${esc(g.definition)}</span></div>`).join("")}</div></section>` : "";

  return head("స్టాక్ మార్కెట్ గైడ్ &amp; సాంకేతిక పదకోశం", "భారతీయ స్టాక్ మార్కెట్ నిబంధనలు, సాంకేతిక సూత్రాలు మరియు పదజాలంపై సమగ్ర మార్గదర్శి.") +
    `<section class="catch-hero reveal">
      <div><div class="sect-head" style="margin-top:0"><h2>ప్రధాన <em>సూత్రాలు</em></h2></div><ol>${(c.tldr || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ol></div>
    </section>${chapters}${glossary}`;
};
VIEWS.catchup = VIEWS.guide;

// ---------------------------------------------------------------- Briefs Archive
let briefsData = null;
VIEWS.briefs = async (params) => {
  briefsData = briefsData || await getJSON("data/briefs.json").catch(() => ({ daily: [], weekly: [] }));
  const kind = params.kind === "weekly" ? "weekly" : "daily";
  const list = briefsData[kind] || [];
  const stamp = (b) => {
    const d = new Date(b.generated);
    return `<div class="stamp"><b>${d.toLocaleDateString("te-IN", { month: "short", day: "numeric" })}</b>${d.toLocaleDateString("te-IN", { weekday: "long" })}<br>${clock(b.generated)}</div>`;
  };
  return head("మార్కెట్ సమీక్షల ఆర్కైవ్", "రోజువారీ డైలీ బ్రీఫింగ్లు మరియు వారపు సమగ్ర మార్కెట్ సమీక్షలు.", plural(list.length, kind === "weekly" ? "వారపు నివేదికలు" : "డైలీ బ్రీఫింగ్లు")) +
    `<div class="filters">${seg("kind", "రకం", [["daily", "రోజువారీ బ్రీఫింగ్"], ["weekly", "వారపు సమీక్ష"]], kind)}</div>` +
    (list.length ? `<div class="reveal">${list.map((b) => issue(b, stamp(b))).join("")}</div>` : '<div class="empty">సమీక్షలు త్వరలో అప్డేట్ అవుతాయి.</div>');
};

// ---------------------------------------------------------------- Saved Stories
VIEWS.saved = async () => {
  const rows = [...state.saved.values()].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  remember(rows);
  return head("సేవ్ చేసిన వార్తలు", "మీరు తర్వాత చదవడానికి సేవ్ చేసుకున్న వార్తలు (ఈ డివైజ్లోనే భద్రపరచబడతాయి).", plural(rows.length, "వార్తలు")) +
    (river(rows) || '<div class="empty">ఇంకా ఏ వార్తనూ సేవ్ చేయలేదు. ఏదైనా వార్తపై ☆ బటన్ను నొక్కండి.</div>');
};

// ---------------------------------------------------------------- Sources
VIEWS.sources = async () => {
  const src = [...(state.index?.sources || [])].sort((a, b) => a.category.localeCompare(b.category) || b.weight - a.weight || a.name.localeCompare(b.name));
  const run = state.index?.run || {};
  const ok = src.filter((s) => s.ok).length;
  return head("వార్తా మూలాలు (Sources)", `ఈ వెబ్సైట్ వార్తలు సేకరించే అధికారిక మరియు విశ్వసనీయ మార్కెట్ మూలాలు. చివరిసారి సేకరించిన సమయం: ${ago(run.at)}.`, `${ok}/${src.length} యాక్టివ్గా ఉన్నాయి`) +
    `<div class="ledger-wrap reveal"><table class="ledger"><thead><tr><th>మూలం పేరు</th><th>విభాగం</th><th class="n">ప్రాధాన్యత</th><th>స్థితి</th><th class="n">తాజా వార్త</th><th class="n">30 రోజులు</th></tr></thead><tbody>${
      src.map((s, i) => `<tr style="--i:${Math.min(i, 14)}"><td><a href="${safeUrl(s.homepage)}" ${ext}>${esc(s.name)}</a></td><td class="mono">${esc(catName(s.category))}</td><td class="n">${"●".repeat(s.weight)}<span style="opacity:.25">${"●".repeat(5 - s.weight)}</span></td>
        <td class="mono ${s.ok ? "ok" : "fail"}" title="${esc(s.error)}">${s.ok ? "● పనిచేస్తోంది" : "● లోపం — " + esc((s.error || "").slice(0, 36))}</td><td class="n">${s.newest ? ago(s.newest) : "—"}</td><td class="n">${s.items_30d}</td></tr>`).join("")
    }</tbody></table></div>`;
};

// ---------------------------------------------------------------- Palettes
VIEWS.palettes = async () => {
  const week = await loadRange(3).catch(() => []);
  const s = [...week].sort((a, b) => b.score - a.score)[0] || {
    title: "NIFTY 50 రికార్డు స్థాయిలకు ర్యాలీ", source_name: "Economic Times",
    summary: "భారతీయ స్టాక్ మార్కెట్లో ఇన్వెస్టర్ల కొనుగోళ్ల జోరుతో NIFTY సరికొత్త గరిష్టాలకు చేరింది.", category: "indian_markets", importance: 5,
  };
  const current = root.dataset.palette;
  const sample = (p, theme) => `<div class="pal-sample" data-palette="${p.id}" data-theme="${theme}">
      <div class="ps-ticker"><span>తాజాది</span><em>${esc(s.title_te || s.title)}</em></div>
      <div class="ps-body">
        <div class="ps-mark">మార్కెట్ పల్స్</div>
        <div class="kicker"><span class="flag">ముఖ్యాంశం</span><span class="cat cat-${esc(s.category)}">${esc(catName(s.category))}</span><span class="src">${esc(s.source_name)}</span></div>
        <h3 class="hl"><a href="#/palettes" tabindex="-1">${esc(s.title_te || s.title)}</a></h3>
        <p class="dek">${esc((s.summary_te || s.summary || "").slice(0, 150))}</p>
      </div></div>`;
  return head("రంగుల థీమ్లు (Colour Palettes)", "మీకు నచ్చిన రంగుల థీమ్ను ఎంచుకోండి. ఇది ఈ డివైజ్లో భద్రపరచబడుతుంది.") +
    `<div class="pal-grid reveal">${PALETTES.map((p, i) => `<section class="pal-card ${p.id === current ? "current" : ""}" style="--i:${i}">
        <div class="pal-pair">${sample(p, "light")}${sample(p, "dark")}</div>
        <div class="pal-meta"><div><h2>${esc(p.name)}</h2><p>${esc(p.desc)}</p></div>
          ${p.id === current ? '<span class="pal-current">ప్రస్తుతం ఉంది</span>' : `<button class="big-btn" data-choose-palette="${p.id}">${esc(p.name)} వాడండి</button>`}</div>
      </section>`).join("")}</div>`;
};

// ---------------------------------------------------------------- ticker crawl
async function fillTicker() {
  const pulse = state.index?.market_pulse;
  let items = [];
  if (pulse?.indices?.length) {
    items = pulse.indices.map((idx) => {
      const isUp = (idx.change || 0) >= 0;
      const sign = isUp ? "+" : "";
      return `<a href="#/indian_markets"><b>${esc(idx.name)}:</b> ${idx.price ?? "—"} (${sign}${idx.pct_change ?? 0}%)</a><span class="sep">◆</span>`;
    });
  }
  const stories = (await loadRange(2)).filter((s) => s.importance >= 3).slice(0, 15);
  const storyItems = stories.map((s) => `<a href="${safeUrl(s.url)}" ${ext} data-open="${esc(s.id)}"><b>${esc(s.source_name)}</b> ${esc(s.title_te || s.title)}</a><span class="sep">◆</span>`);

  const track = $("#ticker");
  if (!items.length && !storyItems.length) { track.innerHTML = '<a>మార్కెట్ వార్తలు లోడ్ అవుతున్నాయి…</a>'; return; }
  const combined = [...items, ...storyItems].join("");
  track.innerHTML = combined + combined.replace(/<a /g, '<a tabindex="-1" aria-hidden="true" ');
  track.style.setProperty("--crawl", Math.max(50, (items.length + stories.length) * 8) + "s");
}

// ---------------------------------------------------------------- interactions
function cardFor(id) { return document.querySelector(`.story[data-id="${CSS.escape(id)}"]`); }

function setRead(id, card, value) {
  if (value) state.read.add(id); else state.read.delete(id);
  persistRead();
  if (card) {
    card.classList.toggle("read", value);
    const btn = card.querySelector('[data-act="read"]');
    if (btn) btn.textContent = value ? "చదవనిదిగా మార్చు" : "చదివినట్లు గుర్తించు";
    if (value) card.querySelector(".fresh")?.remove();
  }
}

function toggleSave(id, card) {
  const story = onPage.get(id) || state.saved.get(id);
  if (!story) return;
  const on = !state.saved.has(id);
  if (on) state.saved.set(id, { ...story, savedAt: Date.now() });
  else state.saved.delete(id);
  persistSaved();
  const btn = card?.querySelector('[data-act="save"]');
  if (btn) { btn.classList.toggle("on", on); btn.textContent = on ? "★ సేవ్ చేయబడింది" : "☆ సేవ్ చేయి"; btn.setAttribute("aria-pressed", on); }
  toast(on ? "వార్త సేవ్ చేయబడింది" : "సేవ్ నుండి తీసివేయబడింది");
}

function updateSavedCount() {
  const count = state.saved.size;
  const el = $("#saved-count");
  if (el) el.textContent = count > 0 ? ` (${count})` : "";
}

document.addEventListener("click", (e) => {
  const t = e.target;
  const open = t.closest("[data-open]");
  if (open) {
    setRead(open.dataset.open, cardFor(open.dataset.open), true);
    return;
  }

  const act = t.closest("[data-act]");
  if (act) {
    const card = act.closest(".story");
    if (!card) return;
    const id = card.dataset.id;
    if (act.dataset.act === "save") toggleSave(id, card);
    if (act.dataset.act === "read") setRead(id, card, !state.read.has(id));
    return;
  }
  const tag = t.closest("[data-tag]");
  if (tag) { $("#search").value = tag.dataset.tag; search(tag.dataset.tag); return; }

  const param = t.closest("button[data-param]");
  if (param) {
    const { params } = parseHash();
    params[param.dataset.param] = param.dataset.value;
    if (param.dataset.param !== "limit") delete params.limit;
    setParams(params);
    return;
  }
  if (t.closest("[data-mark-all]")) {
    $$(".story").forEach((card) => setRead(card.dataset.id, card, true));
    toast("అన్నింటినీ చదివినట్లు గుర్తించాము");
    return;
  }
  if (t.closest("[data-clear-search]")) {
    e.preventDefault();
    $("#search").value = "";
    const { params } = parseHash();
    delete params.q;
    setParams(params);
    return;
  }
  if (t.closest("[data-choose-palette]")) {
    choosePalette(t.closest("[data-choose-palette]").dataset.choosePalette);
    return;
  }
});

document.addEventListener("change", (e) => {
  const box = e.target.closest('input[type="checkbox"][data-param]');
  if (!box) return;
  const { params } = parseHash();
  params[box.dataset.param] = box.checked ? "1" : "";
  setParams(params);
});

const SEARCHABLE = ["feed", "today", "indian_markets", "stocks_in_news", "global_markets", "earnings", "ipo", "table"];
function search(q) {
  const { route, params } = parseHash();
  if (!SEARCHABLE.includes(route)) {
    location.hash = "#/feed" + (q.trim() ? "?" + new URLSearchParams({ q: q.trim() }) : "");
    return;
  }
  const next = { ...params, q: q.trim() };
  delete next.limit;
  setParams(next);
}

let searchTimer;
$("#search").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => search(e.target.value), 260);
});
$("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  search($("#search").value.trim());
});

// ---------------------------------------------------------------- palettes
const PALETTES = [
  { id: "broadsheet", name: "Broadsheet", desc: "సాంప్రదాయ వార్తాపత్రిక, వార్మ్ న్యూస్ప్రింట్" },
  { id: "salmon", name: "Salmon", desc: "ఫైనాన్షియల్ టైమ్స్ పింక్ పేపర్ & క్లారెట్ ఇంక్" },
  { id: "riso", name: "Riso", desc: "ఫెడరల్ బ్లూ & పింక్ కలయిక" },
  { id: "cobalt", name: "Cobalt", desc: "స్విస్ వైట్ & కోబాల్ట్ బ్లూ" },
  { id: "phosphor", name: "Phosphor", desc: "టెర్మినల్ గ్రీన్ & డార్క్ థీమ్" },
  { id: "nocturne", name: "Nocturne", desc: "మిడ్నైట్ నేవీ & అంబర్ కాంతి" },
];
const root = document.documentElement;
const paletteName = (id) => (PALETTES.find((p) => p.id === id) || PALETTES[0]).name;

function storeLook(key, value) {
  try { localStorage.setItem("pulse." + key, value); } catch (err) { /* private mode */ }
}

function applyLook({ palette = root.dataset.palette, theme = root.dataset.theme } = {}, animate = true) {
  const apply = () => {
    root.dataset.palette = palette;
    root.dataset.theme = theme;
    $("#theme-color").content = getComputedStyle(root).getPropertyValue("--paper").trim();
    renderPaletteMenu();
  };
  if (animate && document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(apply);
  } else apply();
}

function choosePalette(id) {
  storeLook("palette", id);
  applyLook({ palette: id });
  toast("రంగుల ఎంపిక · " + paletteName(id));
  if (parseHash().route === "palettes") render({ keepScroll: true });
}

function renderPaletteMenu() {
  const current = root.dataset.palette, theme = root.dataset.theme;
  $("#palette-menu").innerHTML = `<div class="pal-title">రంగుల ఎంపిక</div>${PALETTES.map((p) => `
    <button class="pal-opt" role="menuitemradio" aria-checked="${p.id === current}" data-choose-palette="${p.id}" data-palette="${p.id}" data-theme="${theme}">
      <span class="pal-chip" aria-hidden="true"><b>అ</b><i></i></span>
      <span class="pal-text"><span class="pal-name">${esc(p.name)}</span><span class="pal-desc">${esc(p.desc)}</span></span>
      <span class="pal-check" aria-hidden="true">${p.id === current ? "●" : ""}</span>
    </button>`).join("")}
    <div class="pal-foot"><a href="#/palettes" data-close-palette>అన్ని థీమ్లను పోల్చి చూడండి →</a><span><kbd>P</kbd> కీ నొక్కండి</span></div>`;
}

function togglePaletteMenu(open) {
  const menu = $("#palette-menu"), btn = $("#palette-btn");
  const show = open ?? menu.hidden;
  menu.hidden = !show;
  btn.setAttribute("aria-expanded", String(show));
  if (show) renderPaletteMenu();
}

$("#palette-btn").addEventListener("click", (e) => { e.stopPropagation(); togglePaletteMenu(); });
document.addEventListener("click", (e) => {
  if (!e.target.closest(".palette-picker")) togglePaletteMenu(false);
});

$("#theme-toggle").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  storeLook("theme", next);
  applyLook({ theme: next });
  toast(next === "dark" ? "రాత్రి ఎడిషన్ (Dark Mode)" : "పగటి ఎడిషన్ (Light Mode)");
});

// ---------------------------------------------------------------- keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  if (e.key === "p" || e.key === "P") {
    const list = PALETTES.map((p) => p.id);
    const i = list.indexOf(root.dataset.palette);
    choosePalette(list[(i + 1) % list.length]);
    return;
  }
  if (e.key === "/") {
    e.preventDefault();
    $("#search").focus();
    $("#search").select();
    return;
  }
  const cards = $$(".story");
  if (!cards.length) return;
  if (e.key === "j" || e.key === "ArrowDown") {
    e.preventDefault();
    state.focus = Math.min(state.focus + 1, cards.length - 1);
    focusCard(cards[state.focus]);
  } else if (e.key === "k" || e.key === "ArrowUp") {
    e.preventDefault();
    state.focus = Math.max(state.focus - 1, 0);
    focusCard(cards[state.focus]);
  } else if (state.focus >= 0 && state.focus < cards.length) {
    const card = cards[state.focus];
    const id = card.dataset.id;
    if (e.key === "m") setRead(id, card, !state.read.has(id));
    if (e.key === "s") toggleSave(id, card);
    if (e.key === "o" || e.key === "Enter") {
      const link = card.querySelector(".hl a");
      if (link) window.open(link.href, "_blank", "noopener");
    }
  }
});

function focusCard(card) {
  $$(".story.focused").forEach((c) => c.classList.remove("focused"));
  if (!card) return;
  card.classList.add("focused");
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------------------------------------------------------------- boot
async function init() {
  try {
    await loadIndex();
  } catch (err) {
    console.warn("Index load failed:", err);
  }
  window.addEventListener("hashchange", () => render());
  await render();
  fillTicker().catch(console.error);
  updateSavedCount();
  LS.set("lastVisit", Date.now());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
