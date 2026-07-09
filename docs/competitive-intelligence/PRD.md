# Product Requirements Document (PRD)

# Competitive Intelligence Platform — Agricultural Biotechnology

| Field | Value |
|---|---|
| **Product name** | Competitive Intelligence Platform (codename: **CIP**) |
| **Company context** | Suterra — agricultural biotechnology (semiochemicals, pheromone-based crop protection) |
| **Document version** | 1.0 |
| **Status** | Draft — for engineering review |
| **Author** | Product / Engineering |
| **Date** | 2026-07-09 |
| **Intended reader** | Software architects, senior engineers, AI engineers, marketing stakeholders |
| **Implementation target** | Python 3.12 backend (FastAPI), Chrome Extension frontend, Claude API for AI tasks |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | 2026-07-01 | Product | Initial outline |
| 0.9 | 2026-07-07 | Product + Engineering | Full agent specifications, data model |
| 1.0 | 2026-07-09 | Product | First complete draft for review |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Problem Statement](#2-background--problem-statement)
3. [Goals, Non-Goals & Success Metrics](#3-goals-non-goals--success-metrics)
4. [Users & Personas](#4-users--personas)
5. [User Journeys](#5-user-journeys)
6. [Scope & Phasing](#6-scope--phasing)
7. [System Architecture](#7-system-architecture)
8. [Data Model](#8-data-model)
9. [Agent Specifications](#9-agent-specifications)
10. [Backend API Specification](#10-backend-api-specification)
11. [Chrome Extension Specification](#11-chrome-extension-specification)
12. [AI Integration Layer](#12-ai-integration-layer)
13. [Translation & Internationalization](#13-translation--internationalization)
14. [Reporting Subsystem (Excel)](#14-reporting-subsystem-excel)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Logging, Error Handling & Retry Policy](#16-logging-error-handling--retry-policy)
17. [Security, Privacy & Compliance](#17-security-privacy--compliance)
18. [Testing Strategy](#18-testing-strategy)
19. [Deployment & Operations](#19-deployment--operations)
20. [Prioritization](#20-prioritization)
21. [Risks & Mitigations](#21-risks--mitigations)
22. [Open Questions](#22-open-questions)
23. [Glossary](#23-glossary)
24. [Appendices](#24-appendices)

---

# 1. Executive Summary

Suterra's marketing and regulatory teams currently monitor competitors, government Plant Protection Product (PPP) registration databases, and emergency-use authorizations **manually**, across **30+ countries and 10+ languages**. This work is slow, error-prone, and reactive: broken government URLs go unnoticed for months, competitor product launches are discovered late, and consolidated reporting is a quarterly copy-paste exercise in Excel.

The **Competitive Intelligence Platform (CIP)** automates this workflow end-to-end. It is a modular, agent-based system:

- A **Python 3.12 / FastAPI backend** orchestrates ten independent agents that check government PPP websites, extract registered products, monitor competitor websites, news, patents, partnerships and emergency authorizations, translate multilingual content to English, and generate consolidated Excel reports.
- A **Chrome Extension** gives the marketing team a lightweight, always-available UI: trigger checks, browse competitors and products, search by country or company, and view reports — without deploying an internal web app.
- The **Claude API** powers all extraction, classification, and translation tasks through modular, versioned prompts that return **strict JSON only**.

The platform launches with a deliberately small, high-value core — the **PPP Website Checker** (Agent 1) — and grows agent by agent into a full monitoring platform. Every architectural decision in this document is made to support that incremental path: SQLite now with a clean migration path to PostgreSQL, agents as isolated modules behind a common interface, and prompts as versioned configuration rather than code.

**Business outcome targeted:** reduce the manual monitoring workload by ≥ 80 %, detect competitor and regulatory changes within 24 hours instead of weeks, and produce always-current Excel intelligence reports on demand.

---

# 2. Background & Problem Statement

## 2.1 Domain context

Suterra develops and sells **semiochemical crop-protection products**: pheromones and other behavior-modifying compounds used for **mating disruption, mass trapping, attract-and-kill, and monitoring** of insect pests. These products are regulated as Plant Protection Products (PPP) and must be registered country by country.

Three information streams drive marketing and regulatory strategy:

1. **Government PPP databases.** Every country maintains an official database of registered plant-protection products (e.g., EU member-state registers, US EPA, national ministries of agriculture). These list product names, registration numbers, registrant companies, approved crops, target pests, status, and approval dates. They are published in the local language, on government websites that are frequently reorganized, moved, or broken.
2. **Emergency authorizations.** Countries grant temporary "emergency use" authorizations (e.g., EU Article 53) that signal market gaps and competitor moves. These appear and disappear from government pages with little notice.
3. **Competitor activity.** Product launches, label changes, price changes, registrations, news, scientific publications, patents, partnerships, and M&A activity across a global set of competitors in the semiochemical / biocontrol space.

## 2.2 Current pain points

| # | Pain point | Consequence |
|---|---|---|
| P1 | Government database URLs break or move without notice; the team maintains them by hand in Excel | Stale links; whole countries silently unmonitored |
| P2 | Product extraction from PPP databases is manual copy-paste, per country, per language | Weeks of effort per refresh cycle; data quickly stale |
| P3 | Competitor websites are checked ad hoc, with no change detection | Launches and label changes discovered months late |
| P4 | News / patent / partnership monitoring relies on individual Google alerts | Inconsistent coverage, no consolidation, no history |
| P5 | Ten+ working languages (FR, ES, DE, IT, EL, JA, PT, NL, TR, …) | Only bilingual team members can cover certain countries |
| P6 | Reporting = manual Excel consolidation | Reports out of date the day they are produced; no audit trail |

## 2.3 Why now, why this shape

- **LLM extraction is now reliable enough** to parse heterogeneous government pages and competitor sites into structured JSON, with human review as a safety net.
- **A Chrome Extension** is the lowest-friction delivery vehicle for a small marketing team: no VPN, no internal web-app hosting, no login portal to build in v1. The extension talks to the backend API.
- **An agent architecture** matches the problem: ten independent, schedulable jobs that share a database and a reporting layer but nothing else. Agents can be built, tested, and shipped one at a time.

---

# 3. Goals, Non-Goals & Success Metrics

## 3.1 Goals

| ID | Goal | Measure |
|---|---|---|
| G1 | Automate verification of every country's PPP database URL | 100 % of tracked URLs checked on schedule; broken URLs flagged < 24 h |
| G2 | Maintain a structured, current database of competitor companies and products | ≥ 95 % of tracked competitor product pages reflected in DB |
| G3 | Detect competitor website changes (new/removed/updated products) automatically | Change detected within one monitoring cycle (default: daily) |
| G4 | Consolidate news, patents, partnerships and emergency authorizations into one queryable store | Single search across all streams from the extension |
| G5 | Translate all captured foreign-language content to English automatically | 100 % of stored records have English fields populated |
| G6 | Generate and update Excel intelligence reports on demand and on schedule | One-click report; < 60 s generation for full workbook |
| G7 | Reduce manual monitoring workload | ≥ 80 % reduction (self-reported by marketing team after 3 months) |

## 3.2 Non-Goals (v1)

- **No multi-tenant SaaS.** Single-team, single-deployment tool.
- **No user management / RBAC in v1.** A single shared API key protects the backend (see §17); full auth is Phase 3+.
- **No mobile app.** Chrome Extension + Excel outputs only.
- **No automated outbound actions.** The platform observes and reports; it never contacts competitors, submits forms on government sites, or bypasses access controls.
- **No CRM integration** in v1 (export via Excel covers the need).
- **No scraping of sources that prohibit it.** Robots.txt and terms of service are respected (see §17.3).

## 3.3 Success metrics (KPIs)

| KPI | Baseline | Target (3 months post-launch) |
|---|---|---|
| Countries with verified, working PPP URLs | ~60 % (estimated) | ≥ 98 % |
| Mean time to detect a broken government URL | Weeks–months | < 24 h |
| Mean time to detect a competitor product change | Weeks | < 24 h (daily cycle) |
| Manual hours spent on monitoring per month | ~80 h | ≤ 15 h |
| Report generation time | 1–2 days | < 60 s |
| Records with English translation | ~0 % automated | 100 % |
| Agent run success rate | n/a | ≥ 95 % of scheduled runs complete without unhandled error |

---

# 4. Users & Personas

## 4.1 Persona 1 — Marketing Intelligence Analyst ("Claire")

- **Role:** Owns competitor monitoring; produces the quarterly intelligence report.
- **Skills:** Expert in Excel; comfortable with a browser; not a programmer.
- **Needs:** One place to see all competitor products and changes; Excel exports she can slice; alerts when something changes; search by company / country / crop / pest.
- **Primary surface:** Chrome Extension (dashboard, search, reports).

## 4.2 Persona 2 — Regulatory Affairs Specialist ("Marco")

- **Role:** Tracks registrations and emergency authorizations per country.
- **Needs:** Reliable, current links to every government PPP database; list of new/expired emergency authorizations; registration data (numbers, status, dates) extracted and translated.
- **Primary surface:** Chrome Extension (country search, website status), Excel reports.

## 4.3 Persona 3 — Platform Operator ("Dev")

- **Role:** Engineer who deploys, schedules, and maintains the platform; adds new agents.
- **Needs:** Clean modular codebase; one-command deployment (Docker Compose); structured logs; configuration via environment variables; unit tests; documented agent interface for extension.
- **Primary surface:** CLI, Docker, logs, code.

## 4.4 Persona 4 — Marketing Director ("Sophie") *(secondary)*

- **Role:** Consumes the summary worksheet of the Excel report; occasionally opens the extension dashboard.
- **Needs:** A one-page summary: what changed this period, by competitor and by country.

---

# 5. User Journeys

## 5.1 Journey A — Verify all government PPP URLs (Claire / Marco)

1. Marco opens the Chrome Extension popup and clicks **"Check URLs"** (or the nightly schedule has already run).
2. Agent 1 iterates the country list, checks each PPP database URL (HTTP status, redirects, SSL, timeout).
3. For broken URLs, the agent searches for an official replacement, verifies the domain is governmental, and records a **proposed** replacement.
4. Marco opens the **Website Status** view: green (OK), amber (redirected / proposed replacement pending review), red (broken, no replacement found).
5. Marco approves or rejects proposed replacements in one click. Approved URLs update the database and the Excel master file.
6. A run report (summary + per-country detail) is stored and downloadable.

**Acceptance:** the full check of ~40 countries completes in < 15 minutes; no URL is auto-replaced without either explicit approval or the `AUTO_APPROVE_REPLACEMENTS` config flag being enabled.

## 5.2 Journey B — Add and profile a new competitor (Claire)

1. Claire is on a competitor's website. She opens the extension popup and clicks **"Check Competitor"** (the current tab URL is pre-filled).
2. Backend Agent 2 crawls the site (bounded depth), extracts company profile and product list via Claude, and returns structured JSON.
3. Claire reviews the extracted profile in the dashboard, edits any field, and saves. The competitor and its products are now monitored by Agents 3–6.

**Acceptance:** extraction of a typical competitor site (≤ 50 pages crawled) completes in < 10 minutes; every extracted field is editable before save; nothing is persisted without Claire's confirmation (unless run in scheduled batch mode).

## 5.3 Journey C — Daily change monitoring (system-driven)

1. Scheduler triggers Agents 3 (websites), 4 (news), 7 (emergency authorizations) daily; Agents 5 (patents) and 6 (partnerships) weekly.
2. Each agent writes findings to the database and emits a **change report** (new / removed / updated items).
3. The extension dashboard shows a **"What changed"** feed, newest first, filterable by agent, company, and country.
4. Claire reviews the feed each morning; items can be marked *reviewed*, *important*, or *dismissed*.

## 5.4 Journey D — Generate the consolidated Excel report (Claire / Sophie)

1. Claire clicks **"View Reports" → "Generate report"** in the extension (or the weekly schedule runs).
2. Agent 10 builds the workbook (Countries, Products, Competitors, News, Patents, Emergency Authorizations, Website Status, Summary) from the database.
3. If a previous report exists, Agent 10 **updates** it: preserves manual annotations in designated columns, appends new rows, and marks changed cells.
4. The report is stored under `reports/` with a timestamped filename plus a stable `latest.xlsx` copy; the extension offers a download link.

## 5.5 Journey E — Extract products from a government database (Marco)

1. Marco selects a country in the extension and clicks **"Check Products"**.
2. Agent 8 fetches the country's PPP database (HTML pages, search results, or downloadable files), extracts product records via Claude, and Agent 9 translates fields to English.
3. New and changed registrations appear in the change feed and in the next Excel report.

---

# 6. Scope & Phasing

The platform is delivered in four phases. **Each phase is independently shippable and useful.** Agents are developed one at a time, in priority order — the codebase must never depend on an agent that does not exist yet.

## 6.1 Phase 0 — Foundation (no agents)

**Deliverables:**
- Repository skeleton (see §7.5), configuration system, logging framework, retry utilities.
- SQLAlchemy models + Alembic migrations for the full schema (§8) — the schema ships complete even though most tables start empty, so later agents never require migrations of Phase-1 data.
- FastAPI application with health check, database session management, and the agent-run orchestration endpoints (§10).
- Docker / docker-compose setup; CI running lint + type-check + unit tests.

**Exit criteria:** `docker compose up` yields a healthy API; `pytest` green; `GET /health` returns build info.

## 6.2 Phase 1 — Website Checker MVP

**Deliverables:** Agent 1 (PPP Website Checker), Agent 10 in minimal form (Website Status + Countries + Summary worksheets), Chrome Extension popup with "Check URLs" and Website Status view.

**Exit criteria:** Journey A works end-to-end against the real country list.

## 6.3 Phase 2 — Competitor Intelligence

**Deliverables:** Agent 2 (Competitor Database Builder), Agent 3 (Website Monitor), Agent 9 (Translation), Agent 10 extended (Competitors, Products worksheets), extension dashboard with competitor/product browsing and the change feed.

**Exit criteria:** Journeys B and C (websites only) work end-to-end for ≥ 10 competitors.

## 6.4 Phase 3 — Full Monitoring Platform

**Deliverables:** Agent 4 (News), Agent 5 (Patents), Agent 6 (Partnerships), Agent 7 (Emergency Authorizations), Agent 8 (PPP Product Extractor), Agent 10 complete (all worksheets, update-in-place), extension settings page, dark mode, scheduling UI.

**Exit criteria:** All journeys work; KPI instrumentation live.

## 6.5 Out of scope (all phases)

See §3.2. Additionally out of scope: browser automation against sites requiring login/CAPTCHA solving; historical backfill beyond what sources publicly expose; sentiment analysis; price forecasting.

---

# 7. System Architecture

## 7.1 Overview

```
┌─────────────────────────────┐        ┌──────────────────────────────────────────┐
│      Chrome Extension       │        │              Backend (FastAPI)           │
│  popup / dashboard / settings│ HTTPS │                                          │
│  vanilla JS + HTML + CSS    ├───────►│  REST API  ──►  Agent Orchestrator       │
└─────────────────────────────┘  JSON  │                    │                     │
                                       │     ┌──────────────┼──────────────┐      │
                                       │     ▼              ▼              ▼      │
                                       │  Agent 1 …      Agent N       Scheduler  │
                                       │     │  (common AgentBase interface)      │
                                       │     ▼                                    │
                                       │  Services: fetcher (requests/Playwright),│
                                       │  parser (BeautifulSoup), ai (Claude),    │
                                       │  translator, excel (openpyxl), retry     │
                                       │     │                                    │
                                       │     ▼                                    │
                                       │  SQLAlchemy ──► SQLite (→ PostgreSQL)    │
                                       │     │                                    │
                                       │     ▼                                    │
                                       │  data/ (raw snapshots)  reports/ (xlsx)  │
                                       └──────────────────────────────────────────┘
                                                     │ outbound HTTPS
                                                     ▼
                                  Government sites · competitor sites · news ·
                                  Google Patents / Espacenet / WIPO · Claude API
```

## 7.2 Architectural principles

1. **Agents are plugins.** Every agent implements a single abstract interface (`AgentBase`) with `name`, `configure()`, `run(context) -> AgentResult`, and `healthcheck()`. The orchestrator discovers agents from a registry; adding an agent never modifies orchestrator code (Open/Closed).
2. **Agents share nothing except services and the database.** No agent imports another agent. Cross-agent needs (e.g., "translate this") go through shared **services** (`utils/` layer) — translation is both Agent 9 (batch job) and a `TranslationService` other agents call inline.
3. **All AI I/O is JSON.** Every Claude call uses a prompt template that demands JSON-only output, is validated against a Pydantic schema, and is retried with a repair prompt on validation failure (§12.4).
4. **Fetching is a service, not agent code.** One `Fetcher` service wraps `requests` (fast path) and Playwright (JS-rendered pages), with per-domain rate limiting, timeout, retry, user-agent, and robots.txt policy. Agents declare *what* to fetch, never *how*.
5. **Raw before parsed.** Every fetched page/file is snapshotted to `data/raw/{domain}/{date}/` before parsing, so extraction bugs can be replayed without re-fetching (and change detection can diff snapshots).
6. **Database-first, Excel as a view.** Excel files are generated artifacts; the database is the single source of truth. The only exception: human annotation columns in reports are read back on update (§14.4).
7. **SQLite today, PostgreSQL tomorrow.** Only ANSI-portable column types; no SQLite-specific SQL; all access through SQLAlchemy 2.x ORM; connection string comes from config. Migration = change `DATABASE_URL` + run Alembic.
8. **Configuration over code.** Country lists, competitor seeds, schedules, prompt templates, and thresholds live in `config/` (YAML) and environment variables — never hardcoded.

## 7.3 Backend technology choices

| Concern | Choice | Rationale |
|---|---|---|
| Language | Python 3.12 | Team standard; typing improvements |
| API | FastAPI + Uvicorn | Async, Pydantic-native, OpenAPI for free |
| ORM | SQLAlchemy 2.x + Alembic | Portable, mature, migration support |
| Validation | Pydantic v2 | Shared schemas between API and AI layer |
| DB | SQLite (file) → PostgreSQL | Zero-ops start; §7.2 rule 7 guards migration |
| Static fetching | `requests` | Fast, cheap for static pages |
| Dynamic fetching | Playwright (Chromium) | Government/competitor sites with JS rendering |
| HTML parsing | BeautifulSoup (lxml) | Robust, well-known |
| Excel | openpyxl | Read + write + styling, update-in-place |
| AI | Anthropic Claude API | Extraction, classification, translation |
| Logging | `rich` + stdlib logging | Readable console + structured file logs |
| Scheduling | APScheduler (in-process) | No external infra in v1; cron-visible config |
| Tests | pytest + pytest-asyncio + responses/vcr | See §18 |

## 7.4 Concurrency model

- FastAPI serves async endpoints; agent runs execute in a **background task queue** (in-process worker pool, max concurrency configurable, default 2) so HTTP requests return immediately with a `run_id`.
- Within an agent, fetching is parallelized with a bounded semaphore (default 5 concurrent fetches, ≤ 1 concurrent per domain).
- Claude API calls are serialized through a rate-limited client (configurable RPM/TPM budget).
- A given agent may have **at most one run in progress**; the orchestrator rejects overlapping runs with HTTP 409.

## 7.5 Repository structure

```
competitive-intelligence/
├── README.md
├── requirements.txt
├── pyproject.toml                  # tooling config (ruff, mypy, pytest)
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── config/
│   ├── settings.py                 # Pydantic Settings (env-driven)
│   ├── countries.yaml              # country list + PPP database URLs
│   ├── competitors.yaml            # seed competitor list
│   ├── schedules.yaml              # per-agent cron expressions
│   └── prompts/                    # versioned Claude prompt templates
│       ├── company_extraction.v1.md
│       ├── product_extraction.v1.md
│       ├── news_classification.v1.md
│       ├── patent_extraction.v1.md
│       ├── partnership_detection.v1.md
│       ├── ppp_record_extraction.v1.md
│       ├── translation.v1.md
│       └── url_verification.v1.md
├── backend/
│   ├── main.py                     # FastAPI app factory
│   ├── api/
│   │   ├── routes_agents.py
│   │   ├── routes_countries.py
│   │   ├── routes_companies.py
│   │   ├── routes_products.py
│   │   ├── routes_changes.py
│   │   ├── routes_reports.py
│   │   └── routes_search.py
│   ├── orchestrator/
│   │   ├── registry.py             # agent discovery/registration
│   │   ├── runner.py               # background execution, run records
│   │   └── scheduler.py            # APScheduler wiring
│   └── schemas/                    # Pydantic request/response models
├── agents/
│   ├── base.py                     # AgentBase, AgentResult, AgentContext
│   ├── agent01_website_checker/
│   ├── agent02_competitor_builder/
│   ├── agent03_website_monitor/
│   ├── agent04_news_monitor/
│   ├── agent05_patent_monitor/
│   ├── agent06_partnership_monitor/
│   ├── agent07_emergency_auth_monitor/
│   ├── agent08_ppp_extractor/
│   ├── agent09_translator/
│   └── agent10_excel_reporter/
├── database/
│   ├── models.py                   # SQLAlchemy models (§8)
│   ├── session.py
│   └── migrations/                 # Alembic
├── frontend/                       # Chrome Extension (§11)
│   ├── manifest.json
│   ├── popup/
│   ├── dashboard/
│   ├── settings/
│   └── shared/                     # api client, theme, components
├── utils/                          # shared services
│   ├── fetcher.py                  # requests + Playwright + robots + rate limit
│   ├── ai_client.py                # Claude wrapper: prompts, JSON validation
│   ├── translator.py
│   ├── excel.py
│   ├── retry.py
│   ├── logging_config.py
│   └── snapshots.py                # raw data storage + diffing
├── data/                           # raw snapshots (gitignored)
├── reports/                        # generated xlsx (gitignored)
└── tests/
    ├── unit/
    ├── integration/
    └── fixtures/                   # recorded HTML pages, sample DB rows
```

Each `agents/agentNN_*/` package contains `agent.py` (the `AgentBase` implementation), `steps.py` (pure functions for each pipeline step), `schemas.py` (Pydantic models for its AI outputs), and `README.md` (agent-level docs).

---

# 8. Data Model

All tables share three base columns, provided by a common mixin:

| Column | Type | Notes |
|---|---|---|
| `id` | Integer, PK, autoincrement | Surrogate key |
| `created_at` | DateTime (UTC) | Set on insert |
| `updated_at` | DateTime (UTC) | Set on insert, refreshed on update |

Conventions: snake_case names; all timestamps UTC; soft state via `status` enums (stored as strings for portability); free-text foreign-language fields always paired with an `_en` translated column where relevant; JSON payloads stored in `Text` columns as serialized JSON (portable to PostgreSQL `JSONB` later).

## 8.1 `countries`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `name` | String(120) | not null | English name |
| `iso_code` | String(2) | unique, not null | ISO 3166-1 alpha-2 |
| `language_code` | String(8) | not null | Primary language (BCP-47) |
| `region` | String(60) | | e.g. "EU", "North America" |
| `is_active` | Boolean | default true | Excluded from runs when false |
| `notes` | Text | | Free-form |

## 8.2 `ppp_databases`

One row per official government PPP database (a country can have several).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `country_id` | FK → countries | not null, indexed | |
| `name` | String(255) | not null | e.g. "BVL Pflanzenschutzmittel-Datenbank" |
| `url` | String(2048) | not null | Current canonical URL |
| `database_type` | String(30) | enum: `registry`, `emergency_auth`, `other` | |
| `authority` | String(255) | | Issuing government body |
| `requires_js` | Boolean | default false | Route via Playwright |
| `last_verified_at` | DateTime | | Last successful check |
| `status` | String(20) | enum: `ok`, `redirected`, `broken`, `replacement_proposed`, `unknown` | |
| `proposed_url` | String(2048) | | Candidate replacement (Agent 1) |
| `proposed_url_confidence` | Float | | 0–1, from verification (§9.1) |
| `proposed_url_approved` | Boolean | nullable | null = pending review |

## 8.3 `companies`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `name` | String(255) | not null, unique | |
| `country_id` | FK → countries | nullable | Headquarters |
| `website` | String(2048) | | |
| `description` | Text | | |
| `description_en` | Text | | Translated |
| `technologies` | Text (JSON) | | e.g. `["pheromones","attract_and_kill"]` |
| `languages` | Text (JSON) | | Site languages detected |
| `is_competitor` | Boolean | default true | false = partner/other |
| `is_self` | Boolean | default false | Marks Suterra itself |
| `monitoring_enabled` | Boolean | default true | |
| `last_profiled_at` | DateTime | | Last Agent 2 run |

## 8.4 `products`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `company_id` | FK → companies | not null, indexed | |
| `name` | String(255) | not null | Original language |
| `name_en` | String(255) | | Translated |
| `product_type` | String(60) | enum: `mating_disruption`, `mass_trapping`, `attract_and_kill`, `monitoring`, `other` | |
| `technology` | String(120) | | e.g. "aerosol pheromone dispenser" |
| `target_crops` | Text (JSON) | | List of crops (English, normalized) |
| `target_pests` | Text (JSON) | | List of pests (scientific + common names) |
| `price` | String(120) | | As published, with currency; free text |
| `source_url` | String(2048) | | Page the product was extracted from |
| `first_seen_at` | DateTime | not null | |
| `last_seen_at` | DateTime | not null | |
| `status` | String(20) | enum: `active`, `removed`, `unknown` | |
| `raw_extraction` | Text (JSON) | | Full AI extraction payload |

## 8.5 `product_registrations`

Products ↔ countries, from government databases (written by Agent 8).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `product_id` | FK → products | nullable | Linked when matched; else null + `unmatched_name` |
| `unmatched_name` | String(255) | | Name as found when no product match |
| `company_name_raw` | String(255) | | Registrant as listed |
| `country_id` | FK → countries | not null, indexed | |
| `ppp_database_id` | FK → ppp_databases | not null | Provenance |
| `registration_number` | String(120) | indexed | |
| `crops` | Text (JSON) | | |
| `target_pests` | Text (JSON) | | |
| `status` | String(30) | enum: `approved`, `withdrawn`, `expired`, `pending`, `unknown` | |
| `approval_date` | Date | nullable | |
| `expiry_date` | Date | nullable | |
| `source_language` | String(8) | | |
| `raw_record` | Text (JSON) | | Original extracted record |

Unique constraint: (`ppp_database_id`, `registration_number`) when registration_number is present.

## 8.6 `emergency_authorizations`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `country_id` | FK → countries | not null, indexed | |
| `product_name` | String(255) | not null | |
| `company_name` | String(255) | | |
| `crop` | String(255) | | |
| `target_pest` | String(255) | | |
| `authorization_number` | String(120) | | |
| `valid_from` | Date | nullable | |
| `valid_to` | Date | nullable | |
| `status` | String(20) | enum: `active`, `expired`, `removed` | Computed each run |
| `source_url` | String(2048) | | |
| `source_language` | String(8) | | |
| `raw_record` | Text (JSON) | | |

## 8.7 `news`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `company_id` | FK → companies | nullable, indexed | null = industry-level item |
| `title` | String(512) | not null | |
| `title_en` | String(512) | | |
| `summary` | Text | | AI summary |
| `summary_en` | Text | | |
| `url` | String(2048) | unique | Dedup key |
| `source_name` | String(255) | | Publisher |
| `category` | String(30) | enum: `press_release`, `news`, `blog`, `publication`, `product_launch`, `event`, `other` | |
| `published_at` | DateTime | nullable | |
| `language` | String(8) | | |
| `relevance_score` | Float | | 0–1 from AI classification |

## 8.8 `patents`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `company_id` | FK → companies | nullable, indexed | |
| `patent_number` | String(60) | unique per source | |
| `source` | String(20) | enum: `google_patents`, `espacenet`, `wipo` | |
| `title` | String(512) | | |
| `title_en` | String(512) | | |
| `abstract` | Text | | |
| `abstract_en` | Text | | |
| `assignee_raw` | String(255) | | As published |
| `technology_tags` | Text (JSON) | | AI-extracted |
| `publication_date` | Date | nullable | |
| `url` | String(2048) | | |

## 8.9 `partnerships`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `company_id` | FK → companies | not null, indexed | Primary tracked company |
| `partner_name` | String(255) | not null | Other party (may not be tracked) |
| `partnership_type` | String(30) | enum: `acquisition`, `collaboration`, `distribution`, `investment`, `joint_venture`, `other` | |
| `description` | Text | | |
| `description_en` | Text | | |
| `announced_at` | Date | nullable | |
| `source_url` | String(2048) | | |
| `confidence` | Float | | AI confidence 0–1 |

## 8.10 `website_checks`

One row per URL check (append-only history), written by Agent 1.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `ppp_database_id` | FK → ppp_databases | nullable | Set for government URLs |
| `company_id` | FK → companies | nullable | Set for competitor URLs |
| `url` | String(2048) | not null | URL checked |
| `http_status` | Integer | nullable | Final status code |
| `redirect_chain` | Text (JSON) | | Ordered list of hops |
| `final_url` | String(2048) | | After redirects |
| `ssl_valid` | Boolean | nullable | |
| `response_ms` | Integer | nullable | |
| `outcome` | String(20) | enum: `ok`, `redirected`, `broken`, `timeout`, `ssl_error`, `dns_error` | |
| `error_detail` | Text | | |
| `run_id` | FK → agent_runs | not null, indexed | |

## 8.11 `page_snapshots`

Supports change detection (Agents 3, 7).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `url` | String(2048) | not null, indexed | |
| `company_id` | FK → companies | nullable | |
| `content_hash` | String(64) | not null | SHA-256 of normalized text |
| `storage_path` | String(1024) | not null | Path under `data/raw/` |
| `fetched_at` | DateTime | not null | |

## 8.12 `changes`

Unified change feed (written by Agents 3, 4, 5, 6, 7, 8; read by the dashboard and Agent 10).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `agent_name` | String(60) | not null, indexed | Producer |
| `entity_type` | String(30) | enum: `product`, `news`, `patent`, `partnership`, `emergency_auth`, `registration`, `website`, `page` | |
| `entity_id` | Integer | nullable | FK by convention into the entity table |
| `change_type` | String(20) | enum: `new`, `removed`, `updated`, `expired` | |
| `title` | String(512) | not null | Human-readable one-liner (English) |
| `detail` | Text (JSON) | | Field-level before/after |
| `company_id` | FK → companies | nullable, indexed | |
| `country_id` | FK → countries | nullable, indexed | |
| `review_status` | String(20) | enum: `unreviewed`, `reviewed`, `important`, `dismissed`; default `unreviewed` | |
| `run_id` | FK → agent_runs | not null | |

## 8.13 `reports`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `report_type` | String(30) | enum: `full`, `website_status`, `changes` | |
| `file_path` | String(1024) | not null | Under `reports/` |
| `period_start` | DateTime | nullable | |
| `period_end` | DateTime | nullable | |
| `row_counts` | Text (JSON) | | Per-worksheet counts |
| `generated_by_run_id` | FK → agent_runs | | |

## 8.14 `agent_runs`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `agent_name` | String(60) | not null, indexed | |
| `trigger` | String(20) | enum: `manual`, `scheduled`, `api` | |
| `status` | String(20) | enum: `queued`, `running`, `succeeded`, `failed`, `cancelled` | |
| `started_at` | DateTime | nullable | |
| `finished_at` | DateTime | nullable | |
| `stats` | Text (JSON) | | Items processed / created / updated / errors |
| `error_summary` | Text | | Set when failed |

## 8.15 `logs`

Structured application log persisted for the dashboard (in addition to file logs).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `level` | String(10) | indexed | DEBUG/INFO/WARNING/ERROR |
| `agent_name` | String(60) | nullable, indexed | |
| `run_id` | FK → agent_runs | nullable | |
| `message` | Text | not null | |
| `context` | Text (JSON) | | URL, entity ids, etc. |

Retention: `logs` and `website_checks` older than 180 days are pruned by a maintenance job (configurable).

## 8.16 Entity-relationship summary

```
countries 1──n ppp_databases 1──n website_checks
countries 1──n product_registrations n──1 products n──1 companies
countries 1──n emergency_authorizations
companies 1──n products / news / patents / partnerships / page_snapshots
agent_runs 1──n website_checks / changes / logs / reports
changes n──1 companies, countries (nullable)
```

---

# 9. Agent Specifications

Every agent implements the common interface:

```python
class AgentBase(ABC):
    name: str                      # unique registry key, e.g. "website_checker"
    schedule_default: str | None   # cron expression or None (manual only)

    @abstractmethod
    def run(self, ctx: AgentContext) -> AgentResult: ...
    def healthcheck(self) -> HealthStatus: ...
```

`AgentContext` provides: DB session factory, `Fetcher`, `AIClient`, `TranslationService`, config, logger bound to the `run_id`, and run parameters (e.g., a single `country_id` for scoped runs). `AgentResult` carries `stats` (processed/created/updated/failed), a list of produced `changes` ids, and optional artifact paths.

Common requirements for **all** agents:

- **A-COM-1** Every run creates an `agent_runs` row before work starts and finalizes it (status, stats, error summary) in a `finally` block.
- **A-COM-2** Item-level failures (one URL, one page, one record) are logged and counted but never abort the run; run-level failures set status `failed`.
- **A-COM-3** All outbound fetches go through the shared `Fetcher` (rate limits, retries, robots policy, snapshots).
- **A-COM-4** All AI calls go through `AIClient` with a schema; invalid JSON triggers the repair-retry flow (§12.4) before the item is marked failed.
- **A-COM-5** Agents are idempotent per cycle: re-running immediately produces no duplicate rows (dedup keys documented per agent).
- **A-COM-6** Every agent ships unit tests for its `steps.py` functions and at least one integration test against recorded fixtures.

---

## 9.1 Agent 1 — PPP Website Checker

**Purpose:** keep the catalogue of government PPP database URLs verified and current. *(Phase 1 — the MVP.)*

**Trigger:** manual (extension button, API) and scheduled (default: daily 05:00 UTC). Scoped run by `country_id` supported.

**Pipeline:**

1. **Load targets.** All `ppp_databases` rows for active countries (or the scoped country).
2. **Check each URL** via `Fetcher`:
   - HTTP status of the final response; full **redirect chain** recorded.
   - **SSL validity** (certificate verification errors captured separately from HTTP errors).
   - **Timeout** (default 20 s, configurable) → outcome `timeout`.
   - DNS failure → outcome `dns_error`.
   - Outcome classification: `ok` (2xx, same origin), `redirected` (2xx after cross-origin redirect), `broken` (4xx/5xx), `timeout`, `ssl_error`, `dns_error`.
   - Soft-404 heuristic: a 200 page whose title/body matches configurable "not found" patterns (multilingual list in config) is classified `broken`.
3. **Persist** one `website_checks` row per URL; update `ppp_databases.status` and `last_verified_at`.
4. **Replacement search** for `broken` URLs:
   - Build search queries from country + authority + database name (native language + English), via the configured search endpoint.
   - Candidate filtering: prefer government TLDs/domains (`.gov`, `.gouv.fr`, `.gc.ca`, `europa.eu`, national patterns from `config/countries.yaml`).
   - **AI verification step:** fetch each candidate page and ask Claude (prompt `url_verification.v1`) whether it is the official PPP register of that country; response JSON: `{ "is_official": bool, "confidence": float, "authority": str, "reason": str }`.
   - Best candidate with `confidence ≥ 0.7` is stored in `proposed_url` / `proposed_url_confidence`; status → `replacement_proposed`. **The original URL is never overwritten automatically** unless `AUTO_APPROVE_REPLACEMENTS=true` *and* confidence ≥ 0.9.
5. **Update Excel** master (Website Status worksheet) via the Excel service.
6. **Report.** Summary appended to run stats: totals by outcome, list of newly broken URLs, proposed replacements.

**Change feed:** emits `changes` rows (`entity_type=website`) for any status transition (ok→broken, broken→ok, proposal created).

**Dedup key:** none needed (append-only history table).

**Functional requirements:**

| ID | Requirement |
|---|---|
| A1-1 | Check all active URLs in a run; per-URL failures never abort the run |
| A1-2 | Record full redirect chain and final URL |
| A1-3 | Distinguish `ssl_error`, `timeout`, `dns_error`, `broken` outcomes |
| A1-4 | Detect soft-404s via configurable multilingual patterns |
| A1-5 | Propose replacements only from verified government domains, with AI confidence score |
| A1-6 | Human approval flow for replacements via API/extension (approve/reject) |
| A1-7 | Run of 50 URLs completes in < 15 min at default concurrency |

## 9.2 Agent 2 — Competitor Database Builder

**Purpose:** turn a competitor website URL into a structured company profile + product list. *(Phase 2.)*

**Trigger:** manual (extension "Check Competitor", API with `{"website": ...}`) or batch over `config/competitors.yaml` seeds.

**Pipeline:**

1. **Bounded crawl** of the site: start page + navigation discovery, prioritizing URLs matching product/about/contact patterns (multilingual keyword list). Limits: max 50 pages, max depth 3, same registrable domain only.
2. **Language detection** per page (service from Agent 9).
3. **AI extraction:**
   - Company profile (prompt `company_extraction.v1`): name, HQ country, description, technologies, languages.
   - Products (prompt `product_extraction.v1`, per product-bearing page): name, product_type (controlled vocabulary: `mating_disruption`, `mass_trapping`, `attract_and_kill`, `monitoring`, `other`), technology, target crops, target pests, price (as published), registrations mentioned, downloadable resources (label/SDS URLs).
4. **Translation** of non-English fields to `_en` columns (inline `TranslationService`).
5. **Normalization:** crops and pests mapped against a controlled vocabulary in config; unmapped values kept raw and flagged.
6. **Return JSON** (API mode) for human review; **persist** on confirmation, or directly in batch mode. Products upserted by (`company_id`, normalized `name`).

**Output JSON contract:**

```json
{
  "company": {
    "name": "", "country": "", "website": "",
    "description": "", "technologies": [], "languages": []
  },
  "products": [
    {
      "name": "", "product_type": "", "technology": "",
      "target_crops": [], "target_pests": [],
      "price": null, "registrations": [], "downloads": [],
      "source_url": ""
    }
  ],
  "pages_crawled": 0,
  "warnings": []
}
```

**Requirements:**

| ID | Requirement |
|---|---|
| A2-1 | Crawl is bounded (pages/depth/domain) and robots-respecting |
| A2-2 | Every extracted field traceable to a `source_url` |
| A2-3 | Interactive mode returns JSON for review; nothing persisted until confirmed |
| A2-4 | Re-profiling an existing company updates rather than duplicates (upsert) |
| A2-5 | Controlled vocabulary for product_type; unknown → `other` + warning |

## 9.3 Agent 3 — Website Monitor

**Purpose:** detect changes on competitor websites: new products, removed products, updated pages. *(Phase 2.)*

**Trigger:** scheduled (default daily); manual per company.

**Pipeline:**

1. For each `monitoring_enabled` company: fetch tracked pages (product pages seen by Agent 2 + product-index pages).
2. **Page-level diff:** normalize HTML → text, hash, compare with last `page_snapshots` row. Unchanged hash → skip (cheap early exit, no AI cost).
3. **Changed pages** → re-run product extraction (Agent 2's prompt) → structural diff against DB products:
   - Product on page, not in DB → `new` (insert, `first_seen_at`).
   - Product in DB, absent from all pages for `N` consecutive runs (default 3) → `removed` (status change, never delete).
   - Field-level differences (price, crops, pests, label) → `updated` with before/after in `changes.detail`.
4. Emit `changes` rows and update `last_seen_at`.

**Requirements:**

| ID | Requirement |
|---|---|
| A3-1 | Hash-based early exit: unchanged pages consume zero AI tokens |
| A3-2 | Removal requires N consecutive missing cycles (no flapping) |
| A3-3 | Field-level before/after recorded for updates |
| A3-4 | Monitors the product categories: semiochemicals, pheromones, attract-and-kill, monitoring, mass trapping, mating disruption |
| A3-5 | Detects price changes and new registrations mentioned on labels/pages |

## 9.4 Agent 4 — News Monitor

**Purpose:** aggregate competitor and industry news: press releases, news articles, blog posts, scientific publications, product launches, events. *(Phase 3.)*

**Sources (configurable per company):** company newsroom/blog/press pages (discovered by Agent 2 or configured), RSS/Atom feeds where available, and configured industry sources.

**Pipeline:**

1. Fetch each source; extract candidate items (feed entries or listing-page links + dates).
2. **Dedup** by URL (unique constraint) then by (normalized title + date) to catch syndication.
3. **AI classification** (prompt `news_classification.v1`): category (`press_release|news|blog|publication|product_launch|event|other`), companies mentioned, one-paragraph summary, relevance score 0–1 against the semiochemical/biocontrol domain brief embedded in the prompt.
4. Items with relevance < threshold (default 0.4) stored but excluded from feed and reports (configurable).
5. Translate title/summary → `_en`. Emit `changes` (`entity_type=news`, `change_type=new`).

**Requirements:** A4-1 URL-level idempotency; A4-2 relevance scoring with configurable threshold; A4-3 company linking by name matching against `companies` (fuzzy, confidence-gated); A4-4 publication dates parsed across locales.

## 9.5 Agent 5 — Patent Monitor

**Purpose:** track new patent publications by tracked companies and in the semiochemical technology space. *(Phase 3.)*

**Sources:** Google Patents, Espacenet (EPO OPS API where credentials provided, HTML otherwise), WIPO PatentScope. Source adapters implement one `PatentSource` interface — new sources are plugins.

**Pipeline:** for each tracked company (assignee query) and each configured technology query (e.g., "mating disruption", CPC A01N/A01M classes): search each source → parse results → dedup by patent/publication number per source → AI extraction (`patent_extraction.v1`) of title, abstract, assignee, technology tags → link to `companies` by assignee matching → translate → emit `changes`.

**Requirements:** A5-1 per-source adapters behind a common interface; A5-2 dedup on (source, patent_number); A5-3 assignee→company fuzzy matching with confidence, unmatched kept with `company_id=null`; A5-4 query set in config, not code; A5-5 API-first where an official API exists (EPO OPS), polite HTML fallback otherwise.

## 9.6 Agent 6 — Partnership Monitor

**Purpose:** detect acquisitions, collaborations, distribution agreements, investments, joint ventures involving tracked companies. *(Phase 3.)*

**Design note:** Agent 6 is primarily a **derived-signal agent**: it re-analyzes items already collected by Agent 4 (news) plus company press pages, using prompt `partnership_detection.v1` to decide whether an item describes a partnership event, its type, the parties, and a confidence score. This avoids duplicating crawling infrastructure.

**Pipeline:** select unprocessed `news` rows (and optionally re-scan the last N days) → AI detection → for positives with confidence ≥ 0.6, insert `partnerships` row linked to the tracked company, `partner_name` free-text → translate description → emit `changes`.

**Requirements:** A6-1 no duplicate partnership for same (company, partner, type, announced_at ± 7 days); A6-2 confidence stored, low-confidence items flagged for review rather than dropped; A6-3 both directions handled (tracked company as acquirer or target).

## 9.7 Agent 7 — Emergency Authorization Monitor

**Purpose:** monitor every country's emergency-authorization page; detect new, removed, and expired authorizations. *(Phase 3.)*

**Pipeline:**

1. Targets: `ppp_databases` rows with `database_type=emergency_auth`.
2. Fetch + snapshot each page (Playwright where `requires_js`).
3. Hash-based early exit (as Agent 3).
4. Changed pages → AI extraction of the authorization table/list (`ppp_record_extraction.v1` with an emergency-auth variant): product, company, crop, pest, authorization number, validity dates.
5. **Reconciliation** against `emergency_authorizations` for that country:
   - Extracted, not stored → insert, `changes: new`.
   - Stored `active`, not extracted → status `removed`, `changes: removed`.
   - `valid_to` in the past → status `expired`, `changes: expired` (computed even when the page is unchanged).
6. Translate fields → English; source language recorded.

**Requirements:** A7-1 reconciliation is per-country and transactional; A7-2 expiry detection runs every cycle independent of page changes; A7-3 date parsing handles local formats and calendars per `countries.language_code`.

## 9.8 Agent 8 — PPP Product Extractor

**Purpose:** extract registered products from government PPP databases into `product_registrations`. *(Phase 3 — the heaviest agent.)*

**Reality check:** government databases are heterogeneous: HTML search UIs, paginated tables, downloadable XLS/CSV/PDF, sometimes APIs. The agent therefore uses **per-database extraction strategies** declared in `config/countries.yaml`:

```yaml
- country: DE
  ppp_databases:
    - name: BVL online database
      url: https://...
      strategy: html_paginated        # html_single | html_paginated | file_download | api
      requires_js: true
      scope_filter: "pheromone OR semiochemical"   # optional narrowing query
```

**Pipeline:** load strategy → fetch (paginate / download file) → parse to raw records (BeautifulSoup for HTML, openpyxl/csv for files; PDFs flagged for manual handling in v1) → AI normalization per record batch (`ppp_record_extraction.v1`): product, registration number, company, crops, target pests, status, approval date → translate → upsert by (`ppp_database_id`, `registration_number`) → link to `products` by fuzzy (company + product name) matching → emit `changes` for new/status-changed registrations.

**Scope control:** by default only records matching the semiochemical scope filter are ingested (full-register ingestion is a config option per database, off by default — some registers hold 10 000+ products).

**Requirements:** A8-1 strategy-per-database configuration; A8-2 upsert idempotency on registration number; A8-3 batch AI normalization (≤ 20 records per call) with per-batch validation; A8-4 provenance (`ppp_database_id`, `raw_record`) on every row; A8-5 unmatched company/product names preserved raw, never force-linked.

## 9.9 Agent 9 — Translation Agent

**Purpose:** detect language and translate stored content to English. Exposed **both** as a shared `TranslationService` (inline use by other agents) and as a batch agent that backfills any rows with missing `_en` fields. *(Phase 2.)*

**Supported languages (v1):** French, Spanish, German, Italian, Greek, Japanese, Portuguese, Dutch, Turkish (+ English passthrough). Others: best-effort with a warning.

**Pipeline (batch mode):** scan translatable tables for rows where source field is non-empty, `_en` field is null, and detected language ≠ en → batch by language (≤ 30 short fields per call) → prompt `translation.v1` returns `{ "translations": [{"id":…, "text_en":…}], "detected_language": "" }` → write back.

**Requirements:** A9-1 language detection first (cheap heuristic + AI fallback), English text copied not re-translated; A9-2 domain glossary in the prompt (crop names, pest scientific names, regulatory terms) from `config/`; A9-3 translations cached by content hash to avoid re-paying for identical strings; A9-4 batch API for efficiency; A9-5 original text always preserved.

## 9.10 Agent 10 — Excel Report Generator

**Purpose:** generate and update the consolidated Excel workbook. *(Minimal in Phase 1, complete in Phase 3.)*

**Worksheets:**

| Sheet | Content | Key columns |
|---|---|---|
| Summary | KPI header + changes in period by type/company/country | auto-generated, chart-ready tables |
| Countries | Country list + PPP database URLs + status | name, iso, database, url, status, last_verified |
| Website Status | Latest check per URL + history highlights | outcome, http_status, redirect, ssl, proposed replacement |
| Competitors | Company profiles | name, country, website, technologies, product count |
| Products | All products (with `_en` fields) | company, name, type, crops, pests, price, status, first/last seen |
| News | Period's news | date, company, category, title_en, relevance, url |
| Patents | Period's patents | number, source, company, title_en, date, url |
| Emergency Authorizations | Current + recent | country, product, company, crop, pest, validity, status |

**Update-in-place behavior (A10 core requirement):** when regenerating, the agent opens the previous workbook, matches rows by stable keys (entity ids embedded in a hidden `_id` column), then: appends new rows; updates changed cells and highlights them (fill style, legend on Summary); **preserves the designated manual columns** (`Notes`, `Owner`, `Priority` — protected column set in config) by copying them over by `_id`. A fresh timestamped file is written; `latest.xlsx` is replaced atomically; `reports` row recorded.

**Requirements:** A10-1 full workbook < 60 s at 10k rows; A10-2 manual annotation columns survive regeneration; A10-3 changed-cell highlighting with legend; A10-4 stable `_id` keys hidden from users; A10-5 all sheets filterable (auto-filter on header row), frozen header, consistent styling defined once in `utils/excel.py`.

---

# 10. Backend API Specification

REST, JSON, served by FastAPI under `/api/v1`. OpenAPI docs at `/docs`. All endpoints (except `/health`) require the `X-API-Key` header (§17.1). Errors follow one envelope: `{"error": {"code": "", "message": "", "detail": {}}}` with appropriate HTTP status.

## 10.1 System

| Method & path | Purpose |
|---|---|
| `GET /health` | Liveness: version, DB reachable, scheduler state |
| `GET /api/v1/logs?level=&agent=&run_id=&limit=` | Query persisted logs |

## 10.2 Agent orchestration

| Method & path | Purpose |
|---|---|
| `POST /api/v1/agents/{agent_name}/run` | Queue a run; body = agent-specific params (e.g. `{"country_id": 3}` or `{"website": "https://…"}`). Returns `202 {run_id}`. `409` if already running. |
| `GET /api/v1/agents` | List registered agents + schedule + last run summary |
| `GET /api/v1/runs/{run_id}` | Run status, stats, error summary |
| `GET /api/v1/runs?agent=&status=&limit=` | Run history |
| `POST /api/v1/runs/{run_id}/cancel` | Best-effort cancellation |

## 10.3 Domain resources

| Method & path | Purpose |
|---|---|
| `GET /api/v1/countries` / `GET /api/v1/countries/{id}` | Countries + their PPP databases and latest check status |
| `PATCH /api/v1/ppp-databases/{id}` | Edit URL/metadata |
| `POST /api/v1/ppp-databases/{id}/approve-replacement` | body `{"approve": true|false}` — resolves a proposed URL (Journey A step 5) |
| `GET /api/v1/companies?query=&country=&technology=` | Search/list competitors |
| `POST /api/v1/companies` / `PATCH /api/v1/companies/{id}` | Create / edit (incl. confirming an Agent 2 extraction) |
| `GET /api/v1/companies/{id}/products` | Products of a company |
| `GET /api/v1/products?query=&type=&crop=&pest=&country=` | Cross-company product search |
| `GET /api/v1/changes?entity_type=&company=&country=&review_status=&since=&limit=` | The change feed |
| `PATCH /api/v1/changes/{id}` | body `{"review_status": "reviewed"|"important"|"dismissed"}` |
| `GET /api/v1/news`, `/patents`, `/partnerships`, `/emergency-authorizations` | Filterable lists (company, country, date range) |
| `GET /api/v1/search?q=` | Unified search across companies, products, news, patents (G4) |

## 10.4 Reports

| Method & path | Purpose |
|---|---|
| `POST /api/v1/reports/generate` | body `{"report_type": "full"|"website_status"|"changes", "period_days": 30}` → queues Agent 10, returns run_id |
| `GET /api/v1/reports` | List generated reports |
| `GET /api/v1/reports/{id}/download` | Streams the xlsx |
| `GET /api/v1/reports/latest/download` | Streams `latest.xlsx` |

## 10.5 API requirements

- **API-1** Pagination (`limit`/`offset`, default limit 50, max 500) on every list endpoint.
- **API-2** All list endpoints sortable by `created_at`/`updated_at`.
- **API-3** CORS restricted to the extension origin (`chrome-extension://<id>`) and configured dev origins.
- **API-4** Long-running work is never done in a request handler — always a queued run.
- **API-5** Responses are Pydantic models; the OpenAPI schema is the contract the extension is built against.

---

# 11. Chrome Extension Specification

## 11.1 Technical frame

- **Manifest V3**, vanilla JavaScript (ES modules), HTML, CSS. No frameworks, no build step beyond simple bundling; shared code in `frontend/shared/`.
- Talks only to the backend API (`API_BASE_URL` + API key stored in `chrome.storage.sync`, entered in Settings).
- Permissions requested: `storage`, `activeTab` (to pre-fill the current tab URL in "Check Competitor"). No content scripts in v1, no host permissions beyond the API origin.

## 11.2 Surfaces

### Popup (click on toolbar icon; ~360×560)

- Header: platform status dot (from `/health`), dark-mode toggle.
- Quick actions: **Check URLs** (Agent 1), **Check Competitor** (pre-filled with current tab URL), **Generate Report**.
- "What changed" mini-feed: last 5 unreviewed changes; click → dashboard.
- Footer links: Dashboard, Settings.

### Dashboard (full-page extension tab)

- **Overview:** KPI tiles (URLs OK/broken, competitors tracked, changes this week, last report), change feed with filters (agent, company, country, review status) and review actions.
- **Countries:** searchable country table → PPP databases, status badge (green/amber/red per Journey A), approve/reject proposed replacement inline.
- **Competitors:** searchable company list → company detail (profile, products table, news, patents, partnerships tabs).
- **Products:** cross-company product search: filter by type, crop, pest, country.
- **Reports:** list + generate + download.
- **Runs:** agent run history with status and stats (operator view).

### Settings

- API base URL + API key (with "Test connection").
- Dark mode: system / light / dark.
- Default report period; change-feed page size.
- Per-agent schedule display (read-only in v1; schedules are edited in backend config).

## 11.3 UX requirements

| ID | Requirement |
|---|---|
| UX-1 | Modern, minimal design; single CSS design-token file (colors, spacing, type scale) |
| UX-2 | Dark mode via `prefers-color-scheme` + manual override; all surfaces themed |
| UX-3 | Responsive: dashboard usable from 1024px up; popup fixed-size |
| UX-4 | Every long operation shows queued/running state by polling `GET /runs/{id}` (2 s interval, backoff to 10 s) — never a frozen spinner |
| UX-5 | Empty states with guidance ("No competitors yet — open a competitor site and click Check Competitor") |
| UX-6 | All destructive/approval actions confirm inline (no browser `alert()`) |
| UX-7 | Accessible: keyboard navigable, ARIA labels, WCAG AA contrast in both themes |

---

# 12. AI Integration Layer

## 12.1 Client

One `AIClient` wrapper around the Anthropic SDK:

- Model, max tokens, temperature per **task profile** in config (e.g. extraction: low temperature; translation: low; classification: low). Default model configurable via `CLAUDE_MODEL` env var.
- Central rate limiting (requests + token budget per minute) and cost accounting: every call logs prompt name, version, input/output tokens; per-run token totals land in `agent_runs.stats`.
- Timeouts and retry with exponential backoff on 429/5xx (§16.3), honoring `retry-after`.

## 12.2 Prompts as versioned assets

- Every prompt lives in `config/prompts/{name}.v{N}.md` with YAML front-matter: `name`, `version`, `task_profile`, `output_schema` (name of the Pydantic model), `description`.
- Prompts are loaded at startup and referenced by logical name; bumping a version = adding a new file (old versions retained for reproducibility).
- Prompt templates use explicit placeholders (`{{page_text}}`, `{{country}}`); rendering fails hard on missing variables.

## 12.3 JSON-only output contract

Every prompt ends with the same enforced convention: *return only a JSON object matching the given schema; no prose, no markdown fences*. The schema is included in the prompt (generated from the Pydantic model). All ten agents' output shapes (see per-agent contracts, §9, and Appendix B) are Pydantic models in `agents/*/schemas.py`.

## 12.4 Validation & repair loop

1. Call Claude → strip accidental code fences → `json.loads` → Pydantic validation.
2. On failure: one **repair attempt** — re-send with the validation error and the invalid output, asking for corrected JSON only.
3. On second failure: item marked failed, raw output stored in `logs.context` for debugging; run continues (A-COM-2).

## 12.5 Guardrails

- **Untrusted input rule:** all fetched web content is data, never instructions. Prompts wrap page text in delimited blocks and instruct the model to ignore any instructions found inside them (prompt-injection hygiene).
- Page text is truncated/chunked to a configured token budget before inclusion; long tables are chunked with overlap.
- AI never triggers side effects directly: agents interpret validated JSON and decide what to persist.

---

# 13. Translation & Internationalization

- Source languages (v1): **fr, es, de, it, el, ja, pt, nl, tr** (+ en passthrough). The list is config, not code.
- **Detection:** fast heuristic (character ranges + stopword profiles) first; ambiguous cases resolved by the AI during the translation call (`detected_language` in the response).
- **Glossary:** `config/glossary.yaml` maps domain terms (crops, pests — with scientific names —, regulatory vocabulary like "autorisation de mise sur le marché") to canonical English; injected into translation prompts.
- **Caching:** translations cached by (source-language, SHA-256 of text); identical strings across countries are translated once.
- **Storage rule:** original text is always kept; `_en` columns are additive. Reports show English with original on hover/secondary column where space allows.
- Date/number parsing uses locale rules from `countries.language_code` (Agent 7/8 requirement).

---

# 14. Reporting Subsystem (Excel)

(Behavioral spec in §9.10; this section fixes the workbook contract.)

## 14.1 File conventions

- Path: `reports/CIP_report_{type}_{YYYYMMDD_HHMMSS}.xlsx`; `reports/latest.xlsx` replaced atomically (write temp + rename).
- Every sheet: frozen header row, auto-filter, column widths from content, consistent header style; a hidden `_id` column keys each row to its DB entity.

## 14.2 Summary sheet

KPI block (URLs ok/broken, competitors, products, changes by type in period), per-company change counts, per-country registration counts, legend for change highlighting, generation metadata (date, period, app version, run id).

## 14.3 Styling

Defined once in `utils/excel.py` (named styles): header, ok/warn/error badges, changed-cell fill, hyperlink style for URL columns.

## 14.4 Manual annotation columns

`Notes`, `Owner`, `Priority` exist on Competitors, Products, Countries, Website Status sheets. On regeneration they are read from the previous workbook by `_id` and re-applied. These are the **only** cells read back from Excel; everything else is DB-sourced.

---

# 15. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | Agent 1 full run (≤ 50 URLs) < 15 min; report generation < 60 s at 10k rows; API list endpoints p95 < 500 ms |
| NFR-2 | Scale (v1) | ≤ 60 countries, ≤ 100 PPP databases, ≤ 100 competitors, ≤ 5 000 products, ≤ 100k change rows — SQLite is sufficient; schema must carry 10× that on PostgreSQL without change |
| NFR-3 | Reliability | ≥ 95 % scheduled runs succeed; single item failure never kills a run (A-COM-2) |
| NFR-4 | Maintainability | Ruff + mypy (strict on `utils/`, `agents/base.py`, `database/`) in CI; every public function typed + docstring |
| NFR-5 | Extensibility | Adding an agent = new package + registry entry + config; zero orchestrator changes |
| NFR-6 | Portability | `docker compose up` on any Docker host; no OS-specific code |
| NFR-7 | Observability | Every run traceable: run row + bound logs + raw snapshots; token/cost accounting per run |
| NFR-8 | Cost | AI budget guard: configurable per-run and per-day token ceilings; runs pause with status note when exceeded |
| NFR-9 | Data integrity | Destructive DB ops never issued by agents (status flags instead of deletes); nightly SQLite backup file rotation (7 daily, 4 weekly) |
| NFR-10 | Politeness | Per-domain rate limit (default 1 req/2 s), identifying User-Agent with contact email, robots.txt respected (§17.3) |

---

# 16. Logging, Error Handling & Retry Policy

## 16.1 Logging

- `rich` console handler (dev) + rotating JSON-lines file handler (`logs/app.jsonl`) + DB handler (WARNING+ and per-run milestones → `logs` table).
- Correlation: every log record carries `agent_name` and `run_id` when in a run context (contextvars-bound logger).
- Levels: DEBUG (fetch/parse detail), INFO (pipeline milestones), WARNING (item-level failures, low-confidence extractions), ERROR (run-level problems).

## 16.2 Error taxonomy

| Class | Examples | Handling |
|---|---|---|
| Transient network | timeout, connection reset, 502/503/429 | Retry (§16.3), then item-fail |
| Permanent fetch | 404, 410, DNS NXDOMAIN, SSL invalid | No retry; classify outcome (Agent 1) or item-fail |
| Parse | unexpected HTML structure, empty page | Item-fail + snapshot retained for replay |
| AI validation | invalid JSON after repair | Item-fail + raw output logged |
| Data | constraint violation, unmatched FK | Item-fail; never silently swallow |
| System | DB unavailable, disk full | Run-fail fast with clear error |

Custom exception hierarchy: `CIPError` → `FetchError` (`TransientFetchError` / `PermanentFetchError`), `ParseError`, `AIValidationError`, `DataError`, `ConfigError`.

## 16.3 Retry policy (shared `utils/retry.py`)

- Exponential backoff with jitter: base 2 s, factor 2, max 4 attempts, cap 30 s (network); Claude 429 honors `retry-after`.
- Retry only on the transient class; a decorator + explicit call-site form both provided; every retry logged at WARNING with attempt count.

---

# 17. Security, Privacy & Compliance

## 17.1 Authentication & secrets

- Backend protected by a static API key (`X-API-Key`), set via env var; constant-time comparison; key never logged. (Full user auth is deliberately deferred, §3.2.)
- Secrets (Claude API key, API key, optional EPO OPS credentials) only via environment variables / `.env` (gitignored); `.env.example` documents every variable.
- The extension stores the API key in `chrome.storage.sync`; Settings masks it after entry.

## 17.2 Transport & surface

- Deployment behind HTTPS (reverse proxy in docker-compose profile); CORS locked to the extension origin; no cookies, no session state.
- SQL only via ORM/bound parameters; all inbound payloads Pydantic-validated; report downloads served from the known `reports/` directory only (no path traversal).

## 17.3 Responsible collection

- Only **publicly accessible** pages are collected. No login walls, no CAPTCHA circumvention, no paywall bypass — such sources are flagged `requires_manual` and surfaced in reports instead.
- robots.txt is fetched and respected per domain (policy override possible only for the team's own properties, in config, with justification field).
- Rate limits per NFR-10; monitoring frequency capped (max daily per site by default).
- Personal data: none targeted. Only corporate/public regulatory data is stored. Incidental personal names in news items are stored as published; GDPR posture documented in README (legitimate interest, public sources, erasure on request).

## 17.4 Supply chain

- Pinned dependencies (`requirements.txt` with hashes via pip-tools); Dependabot/`pip-audit` in CI; container runs as non-root user; no dynamic code execution on fetched content.

---

# 18. Testing Strategy

| Layer | Approach | Coverage target |
|---|---|---|
| Unit (`tests/unit/`) | Pure functions in each agent's `steps.py`, utils (retry, excel styling, URL classification, language heuristic) — no network, no DB | ≥ 85 % on `utils/` and `steps.py` |
| Data layer | Model constraints, upsert/dedup rules, migrations up+down, against a throwaway SQLite file | All tables |
| AI contracts | Prompt rendering (all placeholders resolve); Pydantic schemas accept recorded good outputs and reject malformed ones; repair loop unit-tested with a **fake AI client** (no live Claude calls in CI) | All prompts |
| Integration (`tests/integration/`) | Full agent pipelines against **recorded fixtures**: saved HTML pages (`tests/fixtures/`), `responses`/VCR-mocked HTTP, fake AI client returning canned JSON | One happy path + one failure path per agent |
| API | FastAPI TestClient: auth, pagination, run lifecycle (queue → status → result), 409 on concurrent run | All endpoints |
| Excel | Generate → reopen with openpyxl → assert sheets, keys, styles; regenerate → assert manual columns preserved | Agent 10 core behaviors |
| E2E (manual, pre-release) | Docker compose up + real run of Agent 1 on a 5-country staging list + extension smoke script | Checklist in README |

CI (GitHub Actions): ruff, mypy, pytest on every push/PR; live-network and live-AI tests excluded by marker (`-m "not live"`), runnable locally with credentials.

---

# 19. Deployment & Operations

## 19.1 Packaging

- `Dockerfile`: multi-stage (builder installs deps incl. Playwright Chromium; slim runtime, non-root user).
- `docker-compose.yml`: `api` service (Uvicorn), volumes for `data/`, `reports/`, SQLite file and logs; optional `caddy`/`nginx` profile for TLS; healthcheck wired to `/health`.
- The in-process scheduler runs inside the `api` service (v1 single-instance deliberately; a separate worker container is the documented scale-up path).

## 19.2 Configuration

All runtime config via env (`config/settings.py`, Pydantic Settings): `DATABASE_URL`, `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`, `API_KEY`, `LOG_LEVEL`, `MAX_CONCURRENT_FETCHES`, `AI_DAILY_TOKEN_BUDGET`, `AUTO_APPROVE_REPLACEMENTS`, schedule overrides. Structural config (countries, competitors, prompts, glossary) via mounted `config/` directory.

## 19.3 Operations

- **Upgrade:** pull image → `alembic upgrade head` (entrypoint runs it automatically) → restart.
- **Backup:** nightly copy of the SQLite file + `reports/` to a mounted backup volume (rotation per NFR-9).
- **PostgreSQL migration runbook** (documented in README): stand up PG → `DATABASE_URL` switch → `alembic upgrade head` → data copy script (provided in `utils/`) → smoke tests.
- **Monitoring (v1):** `/health` polled externally; daily digest of failed runs surfaced on the dashboard Runs page.

---

# 20. Prioritization

MoSCoW over the phased plan (§6):

| Priority | Items |
|---|---|
| **Must (P1)** | Phase 0 foundation; Agent 1; Agent 10 (minimal); popup + Website Status view; approval flow for URL replacements |
| **Must (P2)** | Agent 2; Agent 9 (service + batch); Agent 3; dashboard (overview, countries, competitors, products); change feed |
| **Should** | Agent 7 (emergency auths); Agent 8 (top-10 priority countries first); Agent 4; full Agent 10 update-in-place |
| **Could** | Agent 5; Agent 6; settings-page schedule editing; unified search ranking improvements |
| **Won't (v1)** | Multi-user auth/RBAC; PostgreSQL by default; email/Slack alerting; PDF extraction in Agent 8; CRM integration; mobile |

Sequencing rationale: Agent 1 delivers standalone value with the least AI complexity and exercises the whole foundation (fetcher, DB, scheduler, Excel, extension). Agent 2 must precede Agent 3 (monitor needs a baseline). Agent 9 precedes every content agent that stores foreign text. Agent 6 depends on Agent 4's data. Agent 8 is highest effort/highest value — descoped to priority countries first.

---

# 21. Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Government sites change structure constantly, breaking extraction | High | High | Strategy-per-database config; raw snapshots enable replay; AI extraction is layout-tolerant by design; per-database health metrics on dashboard |
| R2 | AI extraction errors pollute the database | Medium | High | Pydantic validation, confidence fields, human review flows (Agent 2 confirm, replacement approvals), `raw_*` provenance columns, nothing hard-deleted |
| R3 | AI cost overruns | Medium | Medium | Hash-based early exits (A3-1), translation cache, batch calls, token budgets with pause (NFR-8), per-run cost accounting |
| R4 | Sites block automated access | Medium | Medium | Politeness rules (NFR-10), Playwright for JS sites, `requires_manual` flag as graceful degradation — never evasion |
| R5 | SQLite limits (concurrent writes) hit earlier than planned | Low | Medium | Single-writer run queue by design; documented PG runbook (§19.3) |
| R6 | Scope creep: 10 agents at once | High | High | Phased plan (§6) is contractual: an agent is not started until the previous phase's exit criteria pass |
| R7 | Legal/ToS exposure from scraping | Low | High | §17.3 policy; legal review of source list before Phase 3; public-data-only stance |
| R8 | Key-person dependency (single operator) | Medium | Medium | Docker one-command deploy, README runbooks, agent-level READMEs, tests as executable documentation |

---

# 22. Open Questions

| # | Question | Owner | Needed by |
|---|---|---|---|
| Q1 | Final authoritative country list + current URL inventory (seed for `countries.yaml`) | Marco | Phase 1 start |
| Q2 | Initial competitor seed list (~how many? which markets?) | Claire | Phase 2 start |
| Q3 | Search provider for replacement-URL discovery (API choice & budget) | Dev | Phase 1 build |
| Q4 | EPO OPS credentials available? (determines Espacenet adapter path) | Dev | Phase 3 |
| Q5 | Where is the backend hosted (internal server vs. cloud VM)? Drives TLS/backup details | Dev/IT | Phase 1 deploy |
| Q6 | Report retention policy and whether reports must be archived to shared storage | Sophie | Phase 3 |
| Q7 | Threshold review: is 0.4 news-relevance cutoff right for the team? | Claire | Phase 3 tuning |

---

# 23. Glossary

| Term | Definition |
|---|---|
| **PPP** | Plant Protection Product — regulated crop-protection product (EU terminology) |
| **Semiochemical** | Message-bearing chemical mediating insect behavior (pheromones, kairomones) |
| **Mating disruption** | Pheromone-based technique preventing pest mating |
| **Mass trapping / Attract-and-kill / Monitoring** | Other semiochemical product categories tracked by the platform |
| **Emergency authorization** | Temporary national use permit (e.g., EU Reg. 1107/2009 Art. 53) |
| **Agent** | Independent, schedulable pipeline module implementing `AgentBase` |
| **Run** | One execution of one agent, tracked in `agent_runs` |
| **Change feed** | Unified `changes` table + dashboard view of detected differences |
| **Snapshot** | Raw fetched content stored under `data/raw/` for diffing and replay |
| **Strategy** | Per-government-database extraction method declaration (Agent 8) |
| **`_en` column** | English translation of a foreign-language field; original always kept |

---

# 24. Appendices

## Appendix A — Environment variables (`.env.example`)

```
DATABASE_URL=sqlite:///data/cip.db
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-5
API_KEY=change-me
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
MAX_CONCURRENT_FETCHES=5
FETCH_TIMEOUT_SECONDS=20
PER_DOMAIN_DELAY_SECONDS=2
AI_DAILY_TOKEN_BUDGET=2000000
AI_RPM_LIMIT=30
AUTO_APPROVE_REPLACEMENTS=false
REPORTS_DIR=reports
DATA_DIR=data
SNAPSHOT_RETENTION_DAYS=180
```

## Appendix B — Canonical AI output envelopes

All agent-facing AI responses reduce to these Pydantic-validated shapes (full field lists in §9):

```json
// url_verification.v1
{ "is_official": true, "confidence": 0.92, "authority": "", "reason": "" }

// company_extraction.v1 + product_extraction.v1 → §9.2 contract

// news_classification.v1
{ "category": "press_release", "companies": [""], "summary": "",
  "relevance_score": 0.8, "published_at": "2026-07-01" }

// patent_extraction.v1
{ "patent_number": "", "title": "", "abstract": "", "assignee": "",
  "technology_tags": [], "publication_date": null }

// partnership_detection.v1
{ "is_partnership": true, "partnership_type": "distribution",
  "parties": ["", ""], "description": "", "announced_at": null,
  "confidence": 0.75 }

// ppp_record_extraction.v1 (batch)
{ "records": [ { "product": "", "registration_number": "", "company": "",
  "crops": [], "target_pests": [], "status": "approved",
  "approval_date": null, "language": "de" } ] }

// translation.v1 (batch)
{ "detected_language": "fr",
  "translations": [ { "id": 1, "text_en": "" } ] }
```

## Appendix C — Example scheduled calendar (defaults, `config/schedules.yaml`)

| Agent | Default schedule (UTC) |
|---|---|
| 1 Website Checker | daily 05:00 |
| 3 Website Monitor | daily 06:00 |
| 4 News Monitor | daily 07:00 |
| 7 Emergency Auth Monitor | daily 05:30 |
| 9 Translator (backfill) | daily 08:00 |
| 5 Patent Monitor | weekly Mon 04:00 |
| 6 Partnership Monitor | weekly Mon 09:00 |
| 8 PPP Extractor | weekly Sun 03:00 (per-country staggering) |
| 10 Excel Reporter | weekly Fri 12:00 + on demand |
| Maintenance (prune, backup) | daily 02:00 |

## Appendix D — Definition of Done (per agent)

An agent is *done* when: (1) implements `AgentBase` and is registered; (2) config-driven, no hardcoded sources; (3) unit + integration tests green in CI; (4) emits `agent_runs` stats and `changes` rows; (5) survives item-level failures; (6) README in its package documents pipeline, config keys, prompts used, and failure modes; (7) demonstrated end-to-end on real data in a review session; (8) its worksheets/fields appear in the Excel report where applicable.

---

*End of document.*
