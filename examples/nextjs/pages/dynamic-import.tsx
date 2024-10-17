import { Inter } from 'next/font/google'

import dynamic from 'next/dynamic'

// NOTE: This is how we previously embedded the Widget
// - We now recommend using the <ClientOnly/> component see the pages/pages-example.tsx where possible
const DynamicImport = dynamic(() => import('@/components/PagesWidget'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

const _inter = Inter({ subsets: ['latin'] })

export default function DynamicImportPage() {
  return (
    <main>
      <DynamicImport />
    </main>
  )
}
