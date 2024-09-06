import type { WidgetDrawer } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';
import { useCallback, useRef } from 'react';
import { useConfig, useSkeletonToolValues } from '../../store';
import { WidgetViewContainer } from './WidgetViewContainer';

export function WidgetView() {
  const { config } = useConfig();
  const drawerRef = useRef<WidgetDrawer>(null);
  const { isSkeletonShown, isSkeletonSideBySide } = useSkeletonToolValues();

  if (config?.formUpdateKey) {
    // the formUpdateKey is used to force the config to be rerendered
    // it doesn't need to be passed to the Widget
    delete config.formUpdateKey;
  }

  const toggleDrawer = useCallback(() => {
    drawerRef?.current?.toggleDrawer();
  }, []);

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      {!isSkeletonShown || isSkeletonSideBySide ? (
        <LiFiWidget
          config={config}
          ref={drawerRef}
          integrator="li.fi-playground"
          open
        />
      ) : null}
      {isSkeletonShown ? <WidgetSkeleton config={config} /> : null}
    </WidgetViewContainer>
  );
}
