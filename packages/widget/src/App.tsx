import { forwardRef, useMemo } from 'react';
import type { WidgetDrawer } from './AppDrawer';
import { AppDrawer } from './AppDrawer';
import { AppProvider } from './AppProvider';
import { AppRoutes } from './AppRoutes';
import {
  AppContainer,
  AppExpandedContainer,
  FlexContainer,
} from './components/AppContainer';
import { Header } from './components/Header';
import { Initializer } from './components/Initializer';
import { PoweredBy } from './components/PoweredBy';
import { SwapRoutesExpanded } from './components/SwapRoutes';
import { useExpandableVariant } from './hooks';
import type { WidgetConfig, WidgetProps } from './types';

export const App: React.FC<WidgetProps> = forwardRef<WidgetDrawer, WidgetProps>(
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

export const AppDefault = () => {
  const expandable = useExpandableVariant();
  return (
    <AppExpandedContainer>
      <AppContainer>
        <Header />
        <FlexContainer disableGutters>
          <AppRoutes />
        </FlexContainer>
        <PoweredBy />
        <Initializer />
      </AppContainer>
      {expandable ? <SwapRoutesExpanded /> : null}
    </AppExpandedContainer>
  );
};
