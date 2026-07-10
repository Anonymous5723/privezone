# PPP Competitive Intelligence Agent

An internal Suterra tool that monitors competitor websites and reports **new products, new pheromones, Attract & Kill products, patents, and partnerships** — the "V5" milestone from the [PPP Database Manager](../PPP-Database-Extension/README.md) roadmap.

It is a small, local Node.js command-line tool. It uses the **Claude API** with web search and web fetch to research each competitor, then produces a Markdown intelligence report. It deliberately does **not** run inside the Chrome extension — a browser popup only lives while it is open, so it cannot watch sites continuously.

---

## How it works

For each competitor in `config/competitors.json`, the agent:

1. **Researches** recent developments with Claude (`claude-opus-4-8`) using the web-search and web-fetch tools.
2. **Diffs** the findings against the previous run (stored in `data/`) to isolate what is genuinely new.
3. **Writes** a consolidated Markdown report to `reports/`.

```
competitor-intelligence-agent/
├── package.json
├── .env.example              # ANTHROPIC_API_KEY template
├── config/
│   ├── competitors.json      # the watchlist — edit this
│   ├── known-products.json   # competitor product DATABASE (baseline)
│   └── suterra-products.json # Suterra's own products (for threat analysis)
├── src/
│   ├── index.js              # CLI entry point
│   ├── competitors.js        # loads + validates the watchlist
│   ├── known-products.js     # loads the competitor product database
│   ├── anthropic-client.js   # Claude client + model config
│   ├── monitor.js            # researches one competitor → findings
│   ├── store.js              # snapshots + "what's new" diffing
│   ├── library.js            # persistent per-competitor dossiers
│   ├── overlap.js            # threat cross-reference vs Suterra products
│   ├── dashboard.js          # builds the HTML dashboard
│   └── report.js             # renders the Markdown report
├── library/
│   ├── data/                 # accumulated dossiers (git-ignored)
│   └── dashboard.html        # the browsable dashboard (git-ignored)
├── data/                     # per-competitor snapshots (git-ignored)
└── reports/                  # generated Markdown reports (git-ignored)
```

---

## Setup

Requires Node.js 20+.

```bash
cd competitor-intelligence-agent
npm install
cp .env.example .env         # then paste your Anthropic API key into .env
```

Get an API key at <https://console.anthropic.com/settings/keys>.

---

## Configure the watchlist

Edit `config/competitors.json` — an array of competitors:

```json
[
  {
    "name": "Competitor name",
    "website": "https://competitor.com/",
    "notes": "Optional focus for this competitor (product lines, regions…)."
  }
]
```

| Field     | Required | Description                                             |
| --------- | -------- | ------------------------------------------------------- |
| `name`    | yes      | Competitor name (used in the report and snapshot files) |
| `website` | yes      | Primary website — the research starting point           |
| `notes`   | no       | Extra context passed to the analyst                     |

The shipped `competitors.json` is pre-populated with the 9 competitors derived from the team's *New Competitor Information* spreadsheet (CBC/Biogard, Shin-Etsu, Andermatt Biocontrol, M2i Biocontrol, SEDQ, Semios, Bayer, Lithos Crop Protect, Syngenta Biologicals), each with its verified official website. Add or remove entries as needed.

### Baseline: already-tracked products

`config/known-products.json` holds the 18 competitor products already recorded in that spreadsheet (product, pest, country, active ingredients, per competitor). The agent passes each competitor's known products into the prompt and is told **not** to report them again — so a run surfaces only developments beyond what the team already tracks. Regenerate or extend this file whenever the master spreadsheet is updated. Suterra's own products are intentionally excluded.

---

## Run

```bash
# If you use .env, load it first (Node 20.6+ supports --env-file):
node --env-file=.env src/index.js

# …or export the key directly:
ANTHROPIC_API_KEY=sk-ant-... node src/index.js
```

Output:

```
Monitoring 4 competitor(s)…

• Competitor A … 2 new / 5 total
• Competitor B … 0 new / 3 total
...

Report written to reports/report-2026-07-10T....md
```

The first run establishes a baseline (everything is "new"); subsequent runs highlight only what changed. Run it on whatever cadence suits the team (e.g. a weekly cron job).

### Dry run (no API key, no cost)

To verify the pipeline — config loading, diffing, snapshots, and report generation — without making any API calls:

```bash
node src/index.js --dry-run       # or: npm run dry-run
```

Each competitor gets one clearly-labelled `[SAMPLE]` finding so you can see a complete report and confirm everything is wired up. No key is required and no credits are used.

---

## Database vs Library vs Dashboard

The tool separates three layers:

| Layer | File(s) | What it is |
| ----- | ------- | ---------- |
| **Competitor Database** | `config/known-products.json` | The static baseline of competitor products (from the intelligence spreadsheet). Edit when the master sheet changes. |
| **Competitor Library** | `library/data/*.json` | A **living knowledge base** — one growing dossier per competitor. Each run merges new findings (deduplicated, timestamped), so the tool builds institutional memory instead of throwaway reports. |
| **Dashboard** | `library/dashboard.html` | A single self-contained web page the marketing team opens in any browser — searchable, offline, no server. Shows each competitor's products, logged findings, and threat overlaps. |

### Threat analysis (automatic, no API cost)

`config/suterra-products.json` holds Suterra's own products. On every run — **including `--dry-run`** — the agent cross-references each competitor product against them:

- **Direct threat** (red): same target pest **and** same country as a Suterra product — a competitor moving on your market.
- **Overlap** (amber): same target pest in a different country — a competitor to watch.

This runs deterministically on the product data, so it costs nothing and works offline. Open `library/dashboard.html` after any run to browse the results.

---

## Notes & limitations

- **Drafts, not decisions.** Findings are AI-generated and must be verified before acting on them. Each finding cites the source URL it came from.
- **Cost.** Each run makes web-search/fetch calls per competitor; cost scales with the size of the watchlist. Monitor usage in the Anthropic console.
- **Data isn't committed.** `data/` and `reports/` are git-ignored so snapshots and drafts stay local.

---

## Roadmap fit

| Milestone | Status |
| --------- | ------ |
| V5 — AI competitor monitoring (new products, pheromones, Attract & Kill, partnerships) | **this tool** |
| V6 — Patent monitoring | partially covered (patents are a finding category); can be split into a dedicated patent-office watcher |
| V7 — Competitive Intelligence Dashboard | a future UI layer over the reports this agent produces |
