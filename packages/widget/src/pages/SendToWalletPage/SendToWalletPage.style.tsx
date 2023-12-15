import {
  Alert,
  Container,
  InputBase,
  FormControl as MuiFormControl,
  Box,
} from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { TabPanel } from '@mui/lab';

// export const FormControl = styled(MuiFormControl)(({ theme }) => ({}));

export const Input = styled(InputBase)(({ theme }) => ({
  minHeight: '96px',
  alignItems: 'start',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: theme.shape.borderRadius,
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  [`.${inputBaseClasses.input}`]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    height: 32,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
  },
  [`&.${inputBaseClasses.disabled}`]: {
    color: 'inherit',
  },
  [`.${inputBaseClasses.input}.${inputBaseClasses.disabled}`]: {
    WebkitTextFillColor: 'unset',
  },
}));

export const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1.5, 3),
  gap: theme.spacing(2),
}));

export const SentToWalletTabPanel = styled(TabPanel)(({ theme }) => ({
  padding: 0,
}));

export const TabPanelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
