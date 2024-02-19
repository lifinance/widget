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
            containerStyle: {
              border: `1px solid rgb(234, 234, 234)`,
              borderRadius: '16px',
            },
          }}
          integrator="nextjs-example"
        />
      )}
    </main>
  );
}
