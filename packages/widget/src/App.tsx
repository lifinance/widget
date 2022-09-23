import type { AppProps } from './AppProvider';
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
import { useWidgetConfig } from './providers';

export const App: React.FC<AppProps> = ({ config }) => {
  return (
    <AppProvider config={config}>
      <AppDefault />
    </AppProvider>
  );
};

export const AppDefault = () => {
  const { variant } = useWidgetConfig();

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
      {variant === 'expandable' ? <SwapRoutesExpanded /> : null}
    </AppExpandedContainer>
  );
};
