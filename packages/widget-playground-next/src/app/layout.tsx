import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LI.FI Widget',
  description: 'LI.FI widget playground',
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
