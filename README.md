# csvtabs

A simple tool to combine multiple CSV files into one Excel workbook, with each CSV placed in its own sheet (tabs).

## Features
- Drag-and-drop multiple CSV files.
- Automatic sanitization of sheet names for Excel compatibility.
- Combine up to 10 CSV files into a single Excel workbook.
- 100% client-side processing for privacy.

## Prerequisites
- Node.js (v16 or higher) installed on your system.
- A package manager like npm or yarn.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/chengahtung/csvtabs.git
   ```
2. Navigate to the project directory:
   ```bash
   cd csvtabs
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the App
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage
1. Drag and drop your CSV files into the designated area on the webpage.
2. Ensure the files meet the following constraints:
   - Maximum of 10 files.
   - Each file must be less than 10 MB.
   - Total size of all files must not exceed 50 MB.
3. Click the "Download" button to save the combined Excel workbook.

## Technical Details
- **Framework**: Next.js 15
- **Language**: TypeScript
- **CSV Parsing**: PapaParse
- **Excel Generation**: SheetJS (XLSX)

## Support the Project 💖

- If you enjoy csvtabs, you can support development via [donations](https://buymeacoffee.com/chengahtung).  
- In the future, csvtabs may offer a **paid Pro version** with extra features and convenience tools.  
- Supporting now helps keep the project alive and evolving.

### Ways to Support

* **Buy Me a Coffee**: [☕ Buy Me a Coffee](https://buymeacoffee.com/chengahtung)
* **GitHub Sponsors**: [💖 Sponsor on GitHub](https://github.com/sponsors/chengahtung)

[![Sponsor](https://img.shields.io/badge/Sponsor-☕-ff69b4)](https://buymeacoffee.com/chengahtung)