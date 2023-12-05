'use client';
import { forwardRef, useMemo } from 'react';
import { AppDefault } from './AppDefault';
import type { WidgetDrawer } from './AppDrawer';
import { AppDrawer } from './AppDrawer';
import { AppProvider } from './AppProvider';
import type { WidgetConfig, WidgetProps } from './types';

export const App = forwardRef<WidgetDrawer, WidgetProps>(
  ({ elementRef, open, integrator, ...other }, ref) => {
    const config: WidgetConfig = useMemo(
      () => ({ integrator, ...other, ...other.config }),
      [integrator, other],
    );
    return config?.variant !== 'drawer' ? (
      <AppProvider config={config}>
        <AppDefault />
      </AppProvider>
    ) : (
      <AppDrawer
        ref={ref}
        elementRef={elementRef}
        integrator={integrator}
        config={config}
        open={open}
      />
    );
  },
);
