import { Container } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NavigationHeader } from './components/NavigationHeader';
import { WalletHeader } from './components/WalletHeader';
import { SettingsPage } from './pages/SettingsPage';
import { SwapPage } from './pages/SwapPage';
import { SwapFormProvider } from './providers/SwapFormProvider';
import { theme } from './theme';
import { routes } from './utils/routes';

const MainContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'clip',
}));

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <MainContainer maxWidth="sm" disableGutters>
          <WalletHeader />
          <NavigationHeader />
          <SwapFormProvider>
            <Routes>
              <Route path={routes.home} element={<SwapPage />}>
                <Route path={routes.selectToken} element={null} />
              </Route>
              <Route path={routes.settings} element={<SettingsPage />} />
            </Routes>
          </SwapFormProvider>
        </MainContainer>
      </MemoryRouter>
    </ThemeProvider>
  );
}
