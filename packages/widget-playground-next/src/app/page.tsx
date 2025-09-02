'use client'
import dynamic from 'next/dynamic.js'

// Dynamically import the app content to avoid SSR issues
const AppContent = dynamic(
  () => import('./AppContent.js').then((mod) => ({ default: mod.AppContent })),
  {
    ssr: false,
  }
)

export default function Home() {
  return <AppContent />
}

if (!process.env.NEXT_PUBLIC_EVM_WALLET_CONNECT) {
  console.error(
    'NEXT_PUBLIC_EVM_WALLET_CONNECT is require in your .env.local file for external wallet management'
  )
}
