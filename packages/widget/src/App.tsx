import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SwapPage } from './pages/SwapPage';
import { theme } from './theme';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<SwapPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
}
