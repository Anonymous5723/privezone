# PPP Database Manager

A Chrome Extension for the Suterra marketing team that provides one-click access to official government **Plant Protection Product (PPP)** databases and **Emergency Authorization** pages, replacing the shared Word document previously used for this purpose.

- **Manifest V3** · vanilla HTML / CSS / JavaScript (ES6 modules) — no frameworks, no build step
- **Zero permissions** — the extension only opens public government URLs in new tabs
- All country data is loaded dynamically from [`countries.json`](countries.json); nothing is hardcoded

---

## Features (Version 1)

- Browse all countries as cards (flag, name, database language)
- Instant search — typing `Fra` immediately shows *France*, `Spa` shows *Spain*, `Bel` shows *Belgium* (accent-insensitive)
- **Open Database** (blue) — opens the official PPP registry in a new tab
- **Emergency Authorization** (green) — opens the Emergency Authorization page in a new tab; shown as *No Emergency URL* when the source document provides none
- Source notes from the original document (e.g. Spain, Greece) displayed on the card

---

## Installation

### Load the extension in Chrome (unpacked)

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked**.
5. Select the `PPP-Database-Extension/` folder.
6. Pin **PPP Database Manager** from the puzzle-piece menu in the toolbar.

No build step or dependencies are required.

---

## Folder Structure

```
PPP-Database-Extension/
├── manifest.json        # Manifest V3 configuration (no permissions required)
├── popup.html           # Popup markup: header, search bar, card list, footer
├── popup.css            # Design system: palette, cards, buttons, states
├── popup.js             # Entry point: wires data, search and UI together
├── countries.json       # Single source of truth for all country data
├── js/
│   ├── data-service.js  # Loads and validates countries.json
│   ├── search.js        # Instant, accent-insensitive filtering
│   └── ui.js            # Card rendering and list/empty/error states
├── assets/
│   └── flags/           # SVG flags, one per country code (e.g. fr.svg)
├── icons/
│   ├── icon16.png       # Toolbar icon
│   ├── icon48.png       # Extensions page icon
│   └── icon128.png      # Chrome Web Store icon
└── README.md
```

---

## How to Update Countries

All data lives in **`countries.json`**. The extension renders whatever this file contains — no JavaScript changes are ever needed.

Each entry has the following structure:

```json
{
  "country": "France",
  "code": "fr",
  "database": "https://…",
  "emergency": "https://…",
  "language": "French",
  "notes": "Optional remark shown on the card"
}
```

| Field       | Required | Description                                                        |
| ----------- | -------- | ------------------------------------------------------------------ |
| `country`   | yes      | Display name of the country                                        |
| `code`      | yes      | ISO 3166-1 alpha-2 code, used to pick the flag in `assets/flags/`  |
| `database`  | yes      | Official PPP database URL                                          |
| `emergency` | no       | Emergency Authorization URL — leave `""` if none exists            |
| `language`  | no       | Main language of the database website                              |
| `notes`     | no       | Free-text remark from the source document                          |

**To fix a broken URL:** edit the `database` or `emergency` value, save the file, then click the reload icon on `chrome://extensions`.

**To add a country:** append a new object to the array, add a matching `assets/flags/<code>.svg` (a missing flag degrades gracefully — the card simply renders without one), reload the extension.

---

## Roadmap

| Version | Feature                                                                  |
| ------- | ------------------------------------------------------------------------ |
| **V1**  | Country directory with instant search and one-click access *(current)*   |
| **V2**  | Website status checker — detect broken or moved database URLs            |
| **V3**  | Automatic URL updater — suggest corrected links when a URL changes       |
| **V4**  | Excel export — export the country list for reporting                     |
| **V5**  | AI competitor monitoring — track competitor product registrations        |
| **V6**  | Patent monitoring — follow relevant patent filings per market            |
| **V7**  | Competitive Intelligence Dashboard — unified view across V2–V6 signals   |

The modular architecture (data service / search / UI separation, JSON-driven data) is designed so these versions can be added without rewriting Version 1.

---

## Data Source

The initial dataset was extracted from the internal document *“List of PPP databases by country”*. URLs are reproduced **exactly as they appear** in that document; broken links should be corrected directly in `countries.json` (see above).
