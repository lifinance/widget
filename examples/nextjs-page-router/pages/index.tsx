import styles from '@/styles/Home.module.css';
import { Inter } from 'next/font/google';

import dynamic from 'next/dynamic';

const DynamicWidget = dynamic(() => import('@/components/Widget'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className={`${styles.main} ${inter.className}`}>
      <DynamicWidget />
    </main>
  );
}
