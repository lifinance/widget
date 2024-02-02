import { Inter } from 'next/font/google';
import { createTheme } from '@mui/material';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

const initValues = {
  typography: {
    fontFamily: [inter.style.fontFamily, 'sans-serif'].join(','),
  },
  shape: {
    borderRadius: 12,
    borderRadiusSecondary: 12,
  },
};

export const theme = createTheme(initValues);
