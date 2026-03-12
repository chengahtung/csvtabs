import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'CSV Tabs — Convert Multiple CSVs to Excel Sheets',
  description: 'Unlike standard mergers, this tool imports multiple CSV files into separate tabs (sheets) inside a single Excel workbook. 100% free and private in your browser.',
  keywords: 'csv to excel tabs, convert csv to excel multiple sheets, combine csv files into one excel workbook multiple tabs, csv to sheets converter',
  openGraph: {
    title: 'CSV to Excel Tabs',
    description: 'Import multiple CSVs into separate tabs in one Excel file. Free, instant, private.',
  },
  icons: {
    icon: '/favicon.svg',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
