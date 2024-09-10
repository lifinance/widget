import type { RouteObject } from 'react-router-dom';
import { useLocation, useRoutes } from 'react-router-dom';
import { NotFound } from './components/NotFound.js';
import { ActiveTransactionsPage } from './pages/ActiveTransactionsPage/ActiveTransactionsPage.js';
import { LanguagesPage } from './pages/LanguagesPage.js';
import { MainPage } from './pages/MainPage/MainPage.js';
import { RoutesPage } from './pages/RoutesPage/RoutesPage.js';
import { SelectChainPage } from './pages/SelectChainPage/SelectChainPage.js';
import { SelectEnabledToolsPage } from './pages/SelectEnabledToolsPage.js';
import { SelectTokenPage } from './pages/SelectTokenPage/SelectTokenPage.js';
import { SelectWalletPage } from './pages/SelectWalletPage/SelectWalletPage.js';
import { BookmarksPage } from './pages/SendToWallet/BookmarksPage.js';
import { ConnectedWalletsPage } from './pages/SendToWallet/ConnectedWalletsPage.js';
import { RecentWalletsPage } from './pages/SendToWallet/RecentWalletsPage.js';
import { SendToConfiguredWalletPage } from './pages/SendToWallet/SendToConfiguredWalletPage.js';
import { SendToWalletPage } from './pages/SendToWallet/SendToWalletPage.js';
import { SettingsPage } from './pages/SettingsPage/SettingsPage.js';
import { TransactionDetailsPage } from './pages/TransactionDetailsPage/TransactionDetailsPage.js';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage/TransactionHistoryPage.js';
import { TransactionPage } from './pages/TransactionPage/TransactionPage.js';
import { navigationRoutes } from './utils/navigationRoutes.js';

// SelectWalletPage should be accessible from every page and this handler helps avoid creating multiple paths.
// Avoid using it for anything else, we need to come up with a better solution once we have one more page accessible from everywhere.
const NotFoundRouteHandler = () => {
  const { pathname } = useLocation();
  return pathname.includes(navigationRoutes.selectWallet) ? (
    <SelectWalletPage />
  ) : (
    <NotFound />
  );
};

const routes: RouteObject[] = [
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
    path: `${navigationRoutes.settings}/${navigationRoutes.languages}`,
    element: <LanguagesPage />,
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
    path: navigationRoutes.routes,
    element: <RoutesPage />,
  },
  {
    path: navigationRoutes.activeTransactions,
    element: <ActiveTransactionsPage />,
  },
  {
    path: navigationRoutes.sendToWallet,
    element: <SendToWalletPage />,
  },
  {
    path: `${navigationRoutes.sendToWallet}/${navigationRoutes.bookmarks}`,
    element: <BookmarksPage />,
  },
  {
    path: `${navigationRoutes.sendToWallet}/${navigationRoutes.recentWallets}`,
    element: <RecentWalletsPage />,
  },
  {
    path: `${navigationRoutes.sendToWallet}/${navigationRoutes.connectedWallets}`,
    element: <ConnectedWalletsPage />,
  },
  {
    path: navigationRoutes.configuredWallets,
    element: <SendToConfiguredWalletPage />,
  },
  {
    path: navigationRoutes.transactionHistory,
    element: <TransactionHistoryPage />,
  },
  {
    path: `${navigationRoutes.transactionHistory}?/${navigationRoutes.routes}?/${navigationRoutes.transactionExecution}?/${navigationRoutes.transactionDetails}`,
    element: <TransactionDetailsPage />,
  },
  {
    path: `${navigationRoutes.routes}?/${navigationRoutes.activeTransactions}?/${navigationRoutes.transactionExecution}`,
    element: <TransactionPage />,
  },
  {
    path: '*',
    element: <NotFoundRouteHandler />,
  },
];

export const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};
