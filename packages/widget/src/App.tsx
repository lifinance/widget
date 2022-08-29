import { useRoutes } from 'react-router-dom';
import type { AppProps } from './AppProvider';
import { AppProvider } from './AppProvider';
import { AppContainer, FlexContainer } from './components/AppContainer';
import { Header } from './components/Header';
import { Initializer } from './components/Initializer';
import { NotFound } from './components/NotFound';
import { PoweredBy } from './components/PoweredBy';
import { ActiveSwapsPage } from './pages/ActiveSwapsPage';
import { MainPage } from './pages/MainPage';
import { SelectTokenPage } from './pages/SelectTokenPage';
import { SelectWalletPage } from './pages/SelectWalletPage';
import { SettingsPage } from './pages/SettingsPage';
import { SwapDetailsPage } from './pages/SwapDetailsPage';
import { SwapHistoryPage } from './pages/SwapHistoryPage';
import { SwapPage } from './pages/SwapPage';
import { SwapRoutesPage } from './pages/SwapRoutesPage';
import { navigationRoutes } from './utils';

export const App: React.FC<AppProps> = ({ config }) => {
  return (
    <AppProvider config={config}>
      <AppDefault />
    </AppProvider>
  );
};

export const AppDefault = () => {
  return (
    <AppContainer>
      <Header />
      <FlexContainer disableGutters>
        <AppRoutes />
      </FlexContainer>
      <PoweredBy />
      <Initializer />
    </AppContainer>
  );
};

const AppRoutes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <MainPage />,
    },
    {
      path: navigationRoutes.settings,
      element: <SettingsPage />,
    },
    {
      path: navigationRoutes.fromToken,
      element: <SelectTokenPage formType="from" />,
    },
    {
      path: navigationRoutes.toToken,
      element: <SelectTokenPage formType="to" />,
    },
    {
      path: navigationRoutes.swapRoutes,
      element: <SwapRoutesPage />,
    },
    {
      path: navigationRoutes.activeSwaps,
      element: <ActiveSwapsPage />,
    },
    {
      path: navigationRoutes.swapHistory,
      element: <SwapHistoryPage />,
    },
    {
      path: `${navigationRoutes.swapHistory}/${navigationRoutes.swapDetails}`,
      element: <SwapDetailsPage />,
    },
    ...[
      navigationRoutes.selectWallet,
      `${navigationRoutes.swapExecution}/${navigationRoutes.selectWallet}`,
      `${navigationRoutes.swapRoutes}/${navigationRoutes.swapExecution}/${navigationRoutes.selectWallet}`,
    ].map((path) => ({
      path,
      element: <SelectWalletPage />,
    })),
    ...[
      navigationRoutes.swapExecution,
      `${navigationRoutes.swapRoutes}/${navigationRoutes.swapExecution}`,
      `${navigationRoutes.activeSwaps}/${navigationRoutes.swapExecution}`,
    ].map((path) => ({
      path,
      element: <SwapPage />,
    })),
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  return element;
};
