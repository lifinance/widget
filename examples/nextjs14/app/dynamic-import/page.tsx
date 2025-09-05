import dynamic from 'next/dynamic'

// NOTE: This is how we previously embedded the Widget
// - We now recommend using the widget component wrapped in <ClientOnly/> where possible
// - Refer to the app/page.tsx for an example
const DynamicWidget = dynamic(() => import('@/components/DynamicWidget'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

export default function DynamicImportPage() {
  return (
    <main>
      <DynamicWidget />
    </main>
  )
}
