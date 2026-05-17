# 🛡️ LexGuard — Adversarial AI Threat Intelligence & Contract Analyzer

LexGuard is a premium, multi-agent adversarial legal risk analysis platform designed for developers, contractors, and builders. It parses complex documents (PDFs, Images, Word Docs, ZIP archives) and deploys Gemini-powered AI agents to scan for exploitative clauses, hidden liabilities, and unfair legal terms—presenting them in an interactive, cyberpunk hacker-themed terminal dashboard.

---

## 🚀 Key Features

* **🌐 Universal Document Support:** natively parses Word Documents (`.docx` viaMammoth.js), Images/PDFs (multi-modal Gemini Vision API), raw text input, and extracts and runs files from nested `.zip` archives.
* **📈 Real-Time Telemetry Counters:** counts parsed contract clauses dynamically with clean glowing statistics (`TOTAL CLAUSES`, `DANGEROUS`, `FAIR`).
* **📊 Category-Wise Risk Breakdown:** visualizes specific threat vectors (Liability, Termination, Privacy, Compensation, IP Rights) on a GPU-accelerated horizontal bar chart.
* **🔴 Dynamic Threat Color Sync:** finding cards, warnings, and border-glow frequencies automatically cycle between Red (High Risk), Amber (Moderate), and Green (Low) based on the clause severity.
* **💻 Unix Script renegotiation Timeline:** renders actionable contract revisions as step-by-step shell script patches (e.g. `LEGAL_PATCH_01.SH`) along an interactive timeline.

---

## 🛠️ Architecture & Tech Stack

LexGuard is engineered as a **Zero-Setup Single Page Application (SPA)**, optimized for hackathons and offline demonstrations.
- **Core:** Vanilla HTML5, CSS3, and modern Javascript.
- **AI Core:** Google Gemini Pro (`v1beta` / `gemini-flash-latest`).
- **Parsers:** `mammoth.browser.js` (Word parsing), `jszip.js` (ZIP archive extractors).
- **Typography:** `JetBrains Mono` (Terminal elements), `Outfit` & `Inter` (UI headers & content).

---

## ⚡ Quick Start

### Option A: Local HTTP Server (Recommended)
LexGuard runs best inside a lightweight local server. To start the server:
1. Open PowerShell or Terminal in the root directory.
2. Run:
   ```bash
   python -m http.server 8000 --bind 127.0.0.1
   ```
3. Open your browser and navigate to: **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

### Option B: Standalone File Launch
Double-click **`index.html`** in your File Explorer to run it directly inside your default web browser without any installation!

---

## 🔑 AI Key Setup

To connect LexGuard to the live Gemini API:
1. Get your API Key from [Google AI Studio](https://aistudio.google.com/).
2. Open **`app.js`**.
3. On **Line 13**, replace the placeholder with your key:
   ```javascript
   const GEMINI_API_KEY = "YOUR_ACTUAL_GEMINI_KEY";
   ```
4. Save the file and refresh your browser!

---

## 📁 Repository Structure
```bash
Ascent new/
├── index.html        # Main dashboard structure & markup
├── styles.css        # Premium Cyberpunk theme, animations & layouts
├── app.js            # Gemini API integration, parsers, and UI controller
└── README.md         # Documentation & Quickstart Guide
```
