import { Widget } from '@/components/Widget';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function PagesExample() {
  return (
    <main>
      <Widget />
    </main>
  );
}
