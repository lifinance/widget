import { useRoutes } from 'react-router-dom';
import { NotFound } from './components/NotFound';
import { ActiveSwapsPage } from './pages/ActiveSwapsPage';
import { MainPage } from './pages/MainPage';
import { SelectChainPage } from './pages/SelectChainPage';
import { SelectNativeTokenPage } from './pages/SelectNativeTokenPage';
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
      path: navigationRoutes.fromToken,
      element: <SelectTokenPage formType="from" />,
    },
    {
      path: navigationRoutes.toToken,
      element: <SelectTokenPage formType="to" />,
    },
    {
      path: navigationRoutes.toTokenNative,
      element: <SelectNativeTokenPage formType="to" />,
    },
    ...[
      navigationRoutes.fromChain,
      `${navigationRoutes.fromToken}/${navigationRoutes.fromChain}`,
    ].map((path) => ({
      path,
      element: <SelectChainPage formType="from" />,
    })),
    ...[
      navigationRoutes.toChain,
      `${navigationRoutes.toToken}/${navigationRoutes.toChain}`,
    ].map((path) => ({
      path,
      element: <SelectChainPage formType="to" />,
    })),
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
    ...[
      `${navigationRoutes.swapHistory}/${navigationRoutes.swapDetails}`,
      `${navigationRoutes.swapExecution}/${navigationRoutes.swapDetails}`,
      `${navigationRoutes.swapRoutes}/${navigationRoutes.swapExecution}/${navigationRoutes.swapDetails}`,
    ].map((path) => ({
      path,
      element: <SwapDetailsPage />,
    })),
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
