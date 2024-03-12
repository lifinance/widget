import { Suspense, lazy } from 'react';
import { Fallback } from './Fallback';

const LiFiWidgetLazy = lazy(async () => {
  const module = await import('@lifi/widget');

  return { default: module.LiFiWidget };
});

export function LiFiWidget() {
  return (
    <Suspense fallback={<Fallback />}>
      <LiFiWidgetLazy
        config={{
          theme: {
            container: {
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
            },
          },
        }}
        integrator="remix-example"
      />
    </Suspense>
  );
}
