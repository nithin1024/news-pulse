# Adapting this to another topic (e.g. stock-market news)

The pipeline is topic-agnostic; the topic lives in a few files:

1. **Sources**: `src/news_bot/sources.toml`. Replace the AI feeds with
   market feeds (exchange announcements, financial press RSS, company IR
   feeds, central-bank releases, Reddit/HN-style community APIs). Check
   them with `uv run news-bot sources`. The `hn`, `hf_papers` and
   `hf_trending` kinds are AI-specific; drop them or write new adapters
   in `src/news_bot/fetchers.py` (each adapter is one function).
2. **LLM prompts and categories**: `src/news_bot/enrich.py`. Edit
   `CATEGORIES` (e.g. markets, earnings, macro, IPOs, regulation, crypto)
   and the `ITEM_SYSTEM` / `DAILY_SYSTEM` / `WEEKLY_SYSTEM` prompts so the
   reader, the importance scale and "why it matters" fit an investor.
   Keep `_SOURCE_DEFAULT` in sync with the new categories.
3. **Hacker News filter**: `AI_TITLE_RE` in `fetchers.py` (only if you
   keep the HN source).
4. **Site text and branding**: `site/index.html` (title, masthead,
   motto), `site/app.js` (page intros, nav labels), `site/manifest.webmanifest`.
5. **Curated pages**: `content/catchup.json` and `content/conferences.json`
   are AI-specific. Replace them, or empty them (`{"sections": [], "tldr": []}`
   and `[]`) to hide those pages' content.
6. **Secrets**: add your own `GROQ_API_KEY` (free at console.groq.com) as a
   GitHub repository secret, enable Pages (Settings → Pages → Source:
   GitHub Actions) and run the "Collect & publish" workflow.

Note: summaries are LLM-written and are not financial advice. Say so on the site.
