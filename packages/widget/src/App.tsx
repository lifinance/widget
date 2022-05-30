import { Route, Routes } from 'react-router-dom';
import { AppProps, AppProvider } from './AppProvider';
import { AppContainer } from './components/AppContainer';
import { Header } from './components/Header';
import { MainPage } from './pages/MainPage';
import { SelectTokenPage } from './pages/SelectTokenPage';
import { SelectWalletPage } from './pages/SelectWalletPage';
import { SettingsPage } from './pages/SettingsPage';
import { SwapPage } from './pages/SwapPage';
import { SwapRoutesPage } from './pages/SwapRoutesPage';
import { routes } from './utils/routes';

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
      <Routes>
        <Route path={routes.home} element={<MainPage />} />
        <Route path={routes.selectWallet} element={<SelectWalletPage />} />
        <Route path={routes.settings} element={<SettingsPage />} />
        <Route
          path={routes.fromToken}
          element={<SelectTokenPage formType="from" />}
        />
        <Route
          path={routes.toToken}
          element={<SelectTokenPage formType="to" />}
        />
        <Route path={routes.swapRoutes} element={<SwapRoutesPage />} />
        <Route path={routes.swap} element={<SwapPage />} />
      </Routes>
    </AppContainer>
  );
};
