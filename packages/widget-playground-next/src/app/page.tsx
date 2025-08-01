'use client'
import { DrawerControls } from '@lifi/widget-playground'
import { Box } from '@mui/material'
import { WidgetNextView } from '@/app/WidgetNextView'
// The core-js/actual/structured-clone polyfill is only needed for the Next.js implementation
// the lack of structureClone support for Next.js is currently a requested feature
//   https://github.com/vercel/next.js/discussions/33189
import 'core-js/actual/structured-clone'
import '@lifi/widget-playground/fonts'
import { AppProvider } from './AppProvider'

export default function Home() {
  return (
    <AppProvider>
      <Box sx={{ display: 'flex', flexGrow: '1' }}>
        <DrawerControls />
        <WidgetNextView />
      </Box>
    </AppProvider>
  )
}

if (!process.env.NEXT_PUBLIC_EVM_WALLET_CONNECT) {
  console.error(
    'NEXT_PUBLIC_EVM_WALLET_CONNECT is require in your .env.local file for external wallet management'
  )
}
