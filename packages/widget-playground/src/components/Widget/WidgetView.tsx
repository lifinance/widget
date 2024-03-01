import type { WidgetDrawer } from '@lifi/widget';
import { LiFiWidget } from '@lifi/widget';
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
        keyPrefix="c4443ab1e73b0457e3c9959cc5ca516e"
        integrator="li.fi-playground"
        open
      />
    </WidgetViewContainer>
  );
}
