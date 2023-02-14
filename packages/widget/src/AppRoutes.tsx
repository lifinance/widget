import { useRoutes } from 'react-router-dom';
import { NotFound } from './components/NotFound';
import { ActiveSwapsPage } from './pages/ActiveSwapsPage';
import { MainPage } from './pages/MainPage';
import { SelectChainPage } from './pages/SelectChainPage';
import { SelectEnabledToolsPage } from './pages/SelectEnabledToolsPage';
import { SelectTokenPage } from './pages/SelectTokenPage';
import { SelectWalletPage } from './pages/SelectWalletPage';
import { SettingsPage } from './pages/SettingsPage';
import { SwapDetailsPage } from './pages/SwapDetailsPage';
import { SwapHistoryPage } from './pages/SwapHistoryPage';
import { SwapPage } from './pages/SwapPage';
import { SwapRoutesPage } from './pages/SwapRoutesPage';
import { navigationRoutes } from './utils';

export const AppRoutes = () => {
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
      path: `${navigationRoutes.settings}/${navigationRoutes.bridges}`,
      element: <SelectEnabledToolsPage type="Bridges" />,
    },
    {
      path: `${navigationRoutes.settings}/${navigationRoutes.exchanges}`,
      element: <SelectEnabledToolsPage type="Exchanges" />,
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
      path: navigationRoutes.toTokenNative,
      element: <SelectChainPage formType="to" selectNativeToken />,
    },
    {
      path: `${navigationRoutes.fromToken}?/${navigationRoutes.fromChain}`,
      element: <SelectChainPage formType="from" />,
    },
    {
      path: `${navigationRoutes.toToken}?/${navigationRoutes.toChain}`,
      element: <SelectChainPage formType="to" />,
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
      path: `${navigationRoutes.swapHistory}?/${navigationRoutes.swapRoutes}?/${navigationRoutes.swapExecution}?/${navigationRoutes.swapDetails}`,
      element: <SwapDetailsPage />,
    },
    {
      path: `${navigationRoutes.swapRoutes}?/${navigationRoutes.swapExecution}?/${navigationRoutes.selectWallet}`,
      element: <SelectWalletPage />,
    },
    {
      path: `${navigationRoutes.swapRoutes}?/${navigationRoutes.activeSwaps}?/${navigationRoutes.swapExecution}`,
      element: <SwapPage />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  return element;
};
