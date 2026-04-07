import dynamic from 'next/dynamic'

const Widget = dynamic(
  () => import('@/components/Widget').then((mod) => mod.Widget),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: 682 }} />,
  }
)

export default function Home() {
  return (
    <main>
      <Widget />
    </main>
  )
}
