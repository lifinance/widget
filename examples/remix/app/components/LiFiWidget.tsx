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
          containerStyle: {
            border: `1px solid rgb(234, 234, 234)`,
            borderRadius: '16px',
          },
        }}
        integrator="remix-example"
      />
    </Suspense>
  );
}
