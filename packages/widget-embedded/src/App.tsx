import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SwapPage } from './pages/SwapPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3F49E1',
      light: '#ACBEFF',
    },
    secondary: {
      main: '#F5B5FF',
    },
  },
});

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
