import type { WidgetDrawer } from '@lifi/widget';
import { LiFiWidget } from '@lifi/widget';
import {
  WidgetSkeleton,
  WidgetViewContainer,
  useConfig,
} from '@lifi/widget-playground';
import dynamic from 'next/dynamic';
import { useCallback, useRef } from 'react';
import { ClientOnly } from './ClientOnly';

// TODO: Find a way to provide drawer ref to the widget as it doesn't pick it up after loading.
const LiFiWidgetLazyLoaded = dynamic(
  () => import('@lifi/widget').then((module) => module.LiFiWidget),
  {
    loading: () => <WidgetSkeleton />,
    ssr: false,
  },
);

export function WidgetNextView() {
  const { config } = useConfig();
  const drawerRef = useRef<WidgetDrawer>(null);

  const toggleDrawer = useCallback(() => {
    drawerRef?.current?.toggleDrawer();
  }, []);

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      <ClientOnly fallback={<WidgetSkeleton />}>
        <LiFiWidget
          config={config}
          integrator="li.fi-playground"
          ref={drawerRef}
          open
        />
      </ClientOnly>
      {/* <LiFiWidgetLazyLoaded
        config={config}
        integrator="li.fi-playground"
        ref={drawerRef}
        open
      /> */}
    </WidgetViewContainer>
  );
}
