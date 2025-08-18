import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { Metadata } from 'next'

const siteUrl = 'https://playground.li.fi/'
const siteTitle = 'LI.FI Widget Playground'
const siteDescription =
  'Test and customize the LI.FI Widget with our interactive playground. Configure themes, settings, and see real-time previews.'
const siteKeywords = [
  'LI.FI',
  'widget',
  'DeFi',
  'cross-chain',
  'bridge',
  'swap',
  'playground',
]
const ogImage = '/og_image_playground.png'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: 'LI.FI' }],
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: 'LI.FI Widget',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  )
}
