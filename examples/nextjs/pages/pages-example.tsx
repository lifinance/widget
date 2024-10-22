import { Widget } from '@/components/Widget'
import { Inter } from 'next/font/google'

const _inter = Inter({ subsets: ['latin'] })

export default function PagesExample() {
  return (
    <main>
      <Widget />
    </main>
  )
}
