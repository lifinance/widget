'use client';
import { forwardRef, useMemo } from 'react';
import { AppDefault } from './AppDefault';
import type { WidgetDrawer } from './AppDrawer';
import { AppDrawer } from './AppDrawer';
import { AppProvider } from './AppProvider';
import type { WidgetConfig, WidgetProps } from './types';

export const App = forwardRef<WidgetDrawer, WidgetProps>(
  ({ elementRef, open, onClose, integrator, ...other }, ref) => {
    const config: WidgetConfig = useMemo(() => {
      const config = { integrator, ...other, ...other.config };
      if (config.variant === 'drawer') {
        config.containerStyle = {
          height: '100%',
          ...config?.containerStyle,
        };
      }
      return config;
    }, [integrator, other]);

    const app = (
      <AppProvider config={config}>
        <AppDefault />
      </AppProvider>
    );

    if (config.variant === 'drawer') {
      return (
        <AppDrawer
          ref={ref}
          elementRef={elementRef}
          integrator={integrator}
          config={config}
          open={open}
          onClose={onClose}
        >
          {app}
        </AppDrawer>
      );
    }

    return app;
  },
);
