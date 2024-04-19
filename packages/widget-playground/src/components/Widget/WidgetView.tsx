import type { WidgetDrawer } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';
import { useCallback, useRef } from 'react';
import { useConfig } from '../../store';
import { WidgetViewContainer } from './WidgetViewContainer';

export function WidgetView() {
  const { config } = useConfig();
  const drawerRef = useRef<WidgetDrawer>(null);

  const toggleDrawer = useCallback(() => {
    drawerRef?.current?.toggleDrawer();
  }, []);

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      <LiFiWidget
        config={config}
        ref={drawerRef}
        integrator="li.fi-playground"
        open
      />
      <WidgetSkeleton config={config!} />
    </WidgetViewContainer>
  );
}
