import {
  InputBase,
  Box,
  Button,
  Typography,
  IconButton,
  Theme,
} from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { Card } from '../../components/Card';

export const Input = styled(InputBase)(({ theme }) => ({
  minHeight: '64px',
  alignItems: 'start',
  [`.${inputBaseClasses.input}`]: {
    fontWeight: 500,
    lineHeight: '20px',
  },
}));

export const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1.5, 3),
  gap: theme.spacing(1),
}));

export const SendToWalletCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

export const SendToWalletSheetContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(6, 3, 3),
  gap: theme.spacing(3),
}));

export const SendToWalletButtonRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: theme.spacing(1),
}));

export const SendToWalletSheetButton = styled(Button)(({ theme }) => ({
  width: '100%',
}));

const tertiaryButtonStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
  height: '40px',
  fontSize: '14px',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[200]
      : theme.palette.grey[800],
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
  },
  '&:active': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
  },
});
export const SendToWalletButton = styled(Button)(({ theme }) => ({
  ...tertiaryButtonStyles(theme),
}));

export const SendToWalletIconButton = styled(IconButton)(({ theme }) => ({
  ...tertiaryButtonStyles(theme),
  borderRadius: theme.shape.borderRadiusSecondary,
  height: '40px',
}));

export const WalletNumber = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
}));

export const SheetIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '96px',
  height: '96px',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[700]
      : theme.palette.grey[300],
  background:
    theme.palette.mode === 'light'
      ? theme.palette.grey[200]
      : theme.palette.grey[800],
  borderRadius: '50%',
}));

export const SheetTitle = styled(Typography)(() => ({
  fontSize: '18px',
  fontWeight: 700,
}));

export const SheetAddress = styled(Typography)(() => ({
  width: '100%',
  wordWrap: 'break-word',
  lineHeight: '20px',
}));
