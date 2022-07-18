import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppProps, AppProvider } from './AppProvider';
import { AppContainer } from './components/AppContainer';
import { Header } from './components/Header';
import { Initializer } from './components/Initializer';
import { NotFound } from './components/NotFound';
import { MainPage } from './pages/MainPage';
import { SelectTokenPage } from './pages/SelectTokenPage';
import { SelectWalletPage } from './pages/SelectWalletPage';
import { SettingsPage } from './pages/SettingsPage';
import { SwapPage } from './pages/SwapPage';
import { SwapRoutesPage } from './pages/SwapRoutesPage';
import { useWallet } from './providers/WalletProvider';
import { navigationRoutes } from './utils';

export const App: React.FC<AppProps> = ({ config }) => {
  return (
    <AppProvider config={config}>
      <AppDefault />
    </AppProvider>
  );
};

export const AppDefault = () => {
  const { attemptEagerConnect } = useWallet();
  useEffect(() => {
    attemptEagerConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AppContainer>
      <Header />
      <Routes>
        <Route path={navigationRoutes.home} element={<MainPage />} />
        <Route
          path={navigationRoutes.selectWallet}
          element={<SelectWalletPage />}
        />
        <Route
          path={`${navigationRoutes.swapRoutes}/${navigationRoutes.swap}/${navigationRoutes.selectWallet}`}
          element={<SelectWalletPage />}
        />
        <Route path={navigationRoutes.settings} element={<SettingsPage />} />
        <Route
          path={navigationRoutes.fromToken}
          element={<SelectTokenPage formType="from" />}
        />
        <Route
          path={navigationRoutes.toToken}
          element={<SelectTokenPage formType="to" />}
        />
        <Route
          path={navigationRoutes.swapRoutes}
          element={<SwapRoutesPage />}
        />
        <Route
          path={`${navigationRoutes.swapRoutes}/${navigationRoutes.swap}`}
          element={<SwapPage />}
        />
        <Route path={navigationRoutes.swap} element={<SwapPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Initializer />
    </AppContainer>
  );
};
