import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SwapPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
