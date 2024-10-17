import { Inter } from 'next/font/google'

import dynamic from 'next/dynamic'

// NOTE: This is how we previously embedded the Widget
// - We now recommend using the <ClientOnly/> component see the pages/pages-example.tsx
// - This technique has still been useful for importing the Widget using the Pages Router
//   while we have been transitioning to our code in version 3 of Widget
const DynamicWidget = dynamic(
  () => import('@/components/DynamicImportWidget'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
)

const _inter = Inter({ subsets: ['latin'] })

export default function DynamicImportPage() {
  return (
    <main>
      <DynamicWidget />
    </main>
  )
}
