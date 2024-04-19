import type { WidgetDrawer } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';
import { useConfig, WidgetViewContainer } from '@lifi/widget-playground';
import { useCallback, useRef } from 'react';
import { ClientOnly } from './ClientOnly';

export function WidgetNextView() {
  const { config } = useConfig();
  const drawerRef = useRef<WidgetDrawer>(null);

  const toggleDrawer = useCallback(() => {
    drawerRef?.current?.toggleDrawer();
  }, []);

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      <ClientOnly fallback={<WidgetSkeleton config={config!} />}>
        <LiFiWidget
          config={config}
          integrator="li.fi-playground"
          ref={drawerRef}
          open
        />
      </ClientOnly>
    </WidgetViewContainer>
  );
}
