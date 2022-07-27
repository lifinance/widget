import { Route, Routes } from 'react-router-dom';
import { AppProps, AppProvider } from './AppProvider';
import { AppContainer, FlexContainer } from './components/AppContainer';
import { Header } from './components/Header';
import { Initializer } from './components/Initializer';
import { NotFound } from './components/NotFound';
import { PoweredBy } from './components/PoweredBy';
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
        <Routes>
          <Route index element={<MainPage />} />
          <Route
            path={navigationRoutes.selectWallet}
            element={<SelectWalletPage />}
          />
          <Route
            path={`${navigationRoutes.swapExecution}/${navigationRoutes.selectWallet}`}
            element={<SelectWalletPage />}
          />
          <Route
            path={`${navigationRoutes.swapRoutes}/${navigationRoutes.swapExecution}/${navigationRoutes.selectWallet}`}
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
            path={navigationRoutes.swapHistory}
            element={<SwapHistoryPage />}
          />
          <Route
            path={`${navigationRoutes.swapHistory}/${navigationRoutes.swapDetails}`}
            element={<SwapDetailsPage />}
          />
          <Route
            path={navigationRoutes.swapRoutes}
            element={<SwapRoutesPage />}
          />
          <Route path={navigationRoutes.swapExecution} element={<SwapPage />} />
          <Route
            path={`${navigationRoutes.swapRoutes}/${navigationRoutes.swapExecution}`}
            element={<SwapPage />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FlexContainer>
      <PoweredBy />
      <Initializer />
    </AppContainer>
  );
};
