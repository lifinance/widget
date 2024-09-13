'use client';
import { forwardRef, useMemo } from 'react';
import { AppDefault } from './AppDefault.js';
import type { WidgetDrawer } from './AppDrawer.js';
import { AppDrawer } from './AppDrawer.js';
import { AppProvider } from './AppProvider.js';
import type { WidgetConfig, WidgetProps } from './types/widget.js';

export const App = forwardRef<WidgetDrawer, WidgetProps>(
  ({ elementRef, open, onClose, integrator, formApiRef, ...other }, ref) => {
    const config: WidgetConfig = useMemo(() => {
      const config = { integrator, ...other, ...other.config };
      if (config.variant === 'drawer') {
        config.theme = {
          ...config.theme,
          container: {
            height: '100%',
            ...config.theme?.container,
          },
        };
      }
      return config;
    }, [integrator, other]);

    if (config.variant === 'drawer') {
      return (
        <AppProvider config={config} formApiRef={formApiRef}>
          <AppDrawer
            ref={ref}
            elementRef={elementRef}
            config={config}
            open={open}
            onClose={onClose}
          >
            <AppDefault />
          </AppDrawer>
        </AppProvider>
      );
    }

    return (
      <AppProvider config={config} formApiRef={formApiRef}>
        <AppDefault />
      </AppProvider>
    );
  },
);
