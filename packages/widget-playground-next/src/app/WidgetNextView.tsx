import type { WidgetDrawer } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';
import {
  useConfig,
  WidgetViewContainer,
  useSkeletonToolValues,
} from '@lifi/widget-playground';
import { useCallback, useRef } from 'react';
import { ClientOnly } from './ClientOnly';

export function WidgetNextView() {
  const { config } = useConfig();
  const drawerRef = useRef<WidgetDrawer>(null);
  const { isSkeletonShown, isSkeletonSideBySide } = useSkeletonToolValues();

  const toggleDrawer = useCallback(() => {
    drawerRef?.current?.toggleDrawer();
  }, []);

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      {!isSkeletonShown || isSkeletonSideBySide ? (
        <ClientOnly fallback={<WidgetSkeleton config={config} />}>
          <LiFiWidget
            config={config}
            integrator="li.fi-playground"
            ref={drawerRef}
            open
          />
        </ClientOnly>
      ) : null}
      {isSkeletonShown ? <WidgetSkeleton config={config!} /> : null}
    </WidgetViewContainer>
  );
}
