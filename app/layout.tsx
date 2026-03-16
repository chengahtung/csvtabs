import type { Metadata } from 'next';
import './globals.css'; // Global styles
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://csvtabs.vercel.app'),

  title: 'CSV to Excel Tabs — Convert Multiple CSV Files into One Excel Workbook',
  description:
    'Free online tool to convert multiple CSV files into one Excel workbook with separate sheets (tabs). Fast, private, and runs entirely in your browser.',

  keywords: [
    'csv to excel tabs',
    'multiple csv to excel',
    'convert csv to excel sheets',
    'combine csv files into excel workbook',
    'csv to xlsx multiple sheets',
    'merge csv to excel tabs'
  ],

  openGraph: {
    title: 'CSV Tabs — Convert Multiple CSV Files to Excel Sheets',
    description:
      'Upload multiple CSV files and instantly convert them into one Excel workbook with separate tabs. 100% free and private.',
    url: 'https://csvtabs.vercel.app',
    siteName: 'CSV Tabs',
    type: 'website',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'CSV Tabs tool preview',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CSV Tabs — Convert Multiple CSVs to Excel Sheets',
    description:
      'Combine multiple CSV files into one Excel workbook with separate tabs instantly.',
    images: ['/preview.png'],
  },

  icons: {
    icon: '/csvtabs-logo.svg',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}