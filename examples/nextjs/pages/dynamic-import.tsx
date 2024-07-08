import { Inter } from 'next/font/google';

import dynamic from 'next/dynamic';

const DynamicImport = dynamic(() => import('@/components/PagesWidget'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const inter = Inter({ subsets: ['latin'] });

export default function DynamicImportPage() {
  return (
    <main>
      <DynamicImport />
    </main>
  );
}
