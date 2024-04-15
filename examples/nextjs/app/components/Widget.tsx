'use client';
import { LiFiWidget } from '@lifi/widget';
import { useEffect, useState } from 'react';

export function Widget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <main>
      {mounted && (
        <LiFiWidget
          config={{
            theme: {
              container: {
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
              },
            },
          }}
          integrator="nextjs-example"
        />
      )}
    </main>
  );
}
