# CSV Tabs — Convert Multiple CSVs into One Excel Workbook

**Live Tool →** [csvtabs.vercel.app](https://csvtabs.vercel.app)

> Most CSV tools *merge* your files into one giant list. CSV Tabs puts each CSV into its **own sheet** inside a single Excel workbook — no merging, no mixing.

![CSV Tabs Demo](./public/csvtabs_demo.gif)

---

## ✨ Features

- 📂 **Drag & drop** multiple CSV files at once
- 🗂️ Each CSV becomes its **own Excel sheet (tab)**
- 🔤 **Auto-sanitizes** sheet names for Excel compatibility
- 📦 Supports up to **10 files** / **50MB** total
- 🔒 **100% client-side** — your data never leaves your browser
- ⚡ No sign-up, no cost, no limits on rows

---

## 🚀 Use Cases

- Combine **monthly reports** into one workbook for easy review
- Organize data **by category, region, or team** without mixing rows
- Send clients **one clean file** instead of a zip of CSVs
- Keep **distinct datasets together** while keeping them separated

---

## 🔒 Privacy

All processing happens entirely in your browser using JavaScript. **No data is uploaded to any server.** This makes it safe for sensitive, confidential, or proprietary data.

---

## 🛠️ Running Locally

### Prerequisites

- Node.js v16 or higher
- npm or yarn

### Setup

```bash
# Clone the repo
git clone https://github.com/chengahtung/csvtabs.git
cd csvtabs

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 |
| Language | TypeScript |
| CSV Parsing | PapaParse |
| Excel Generation | SheetJS (XLSX) |

---

## 📋 File Constraints

| Limit | Value |
|---|---|
| Max files | 10 |
| Max file size | 10 MB each |
| Max total size | 50 MB |

---

## 💖 Support the Project

CSV Tabs is free and open source. If it saves you time, consider supporting its development:

- ☕ [Buy Me a Coffee](https://buymeacoffee.com/chengahtung)
- 💖 [Sponsor on GitHub](https://github.com/sponsors/chengahtung)

A **Pro version** with extra features may be coming in the future. Supporting now helps keep the project alive and evolving.

---

Built by [Cheng Zhen Tung](https://github.com/chengahtung)