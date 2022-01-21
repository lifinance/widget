import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { SwapPage } from './pages/SwapPage';

const theme = createTheme({
  palette: {
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
