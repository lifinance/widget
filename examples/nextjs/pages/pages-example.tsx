import { Inter } from 'next/font/google'
import { Widget } from '@/components/Widget'

const _inter = Inter({ subsets: ['latin'] })

export default function PagesExample() {
  return (
    <main>
      <Widget />
    </main>
  )
}
