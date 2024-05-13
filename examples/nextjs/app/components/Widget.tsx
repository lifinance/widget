'use client';

import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';
import { useEffect, useState } from 'react';

export function Widget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const config = {
    appearance: 'light',
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>;

  return (
    <main>
      {mounted ? (
        <LiFiWidget config={config} integrator="nextjs-example" />
      ) : (
        <WidgetSkeleton config={config} />
      )}
    </main>
  );
}
