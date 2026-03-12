# CSVTabs Documentation

This document provides a quick reference for the technical architecture, logic, and constraints of the CSVTabs application.

## Core Purpose
CSVTabs is a client-side utility designed to combine multiple CSV files into a single Excel (`.xlsx`) workbook, where each CSV file is converted into an individual worksheet (tab).

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **Icons**: Lucide React
- **CSV Parsing**: [PapaParse](https://www.papaparse.com/)
- **Excel Generation**: [SheetJS (XLSX)](https://sheetjs.com/)

## Architecture & Data Privacy
- **100% Client-Side**: All file processing, parsing, and Excel generation happen entirely in the user's browser.
- **No Server Uploads**: Files are never uploaded to a server, ensuring maximum data privacy and security.
- **Performance**: Processing speed is limited only by the user's local hardware and browser capabilities.

## Logic & Behavior

### File Handling
- **Drag-and-Drop**: Users can drag files directly into the browser.
- **File Selection**: Standard file input picker.
- **CSV Parsing**: Files are parsed into JSON objects before being injected into Excel worksheets.

### Sheet Name Sanitization
To ensure compatibility with Excel standards, sheet names are automatically sanitized:
1. **Forbidden Characters**: Characters like `\ / ? * [ ] :` are removed.
2. **Length Limit**: Sheet names are truncated to **31 characters**.
3. **Duplicates**: The app prevents duplicate sheet names by flagging conflicts.
4. **Empty Names**: If a name becomes empty after sanitization, it defaults to `Sheet_N`.

### Export Process
1. Data is collected from all valid CSV entries.
2. A new Excel workbook is created in memory.
3. For each CSV, a new worksheet is added.
4. The workbook is exported as a `.xlsx` file with a user-defined filename.

## Technical Limits

| Constraint | Limit |
| :--- | :--- |
| **Max Files** | 10 files per session |
| **Max Individual File Size** | 10 MB |
| **Max Total Session Size** | 50 MB |
| **Accepted Formats** | `.csv` only |
| **Sheet Name Length** | 31 characters (Excel standard) |

## Project Structure
- `app/page.tsx`: Main application logic, state management, and UI.
- `lib/utils.ts`: Shared utility functions.
- `hooks/`: Custom React hooks (e.g., responsive design).
- `public/`: Static assets and icons.
