import type { Theme } from '@mui/material';
import {
  Alert,
  Box,
  Button,
  IconButton,
  List,
  Typography,
  alertClasses,
  inputBaseClasses,
  styled,
} from '@mui/material';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import type { PageContainerProps } from '../../components/PageContainer';
import { PageContainer } from '../../components/PageContainer';
import { getContrastAlphaColor } from '../../utils';

export const AddressInput = styled(Input)(({ theme }) => ({
  padding: 0,
  [`.${inputBaseClasses.input}`]: {
    padding: theme.spacing(2),
    minHeight: 48,
  },
}));

export const BookmarkInputFields = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}));

export const SendToWalletPageContainer = styled(
  PageContainer,
)<PageContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const SendToWalletCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
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

const tertiaryButtonStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
  height: 40,
  fontSize: 14,
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

export const SendToWalletIconButton = styled(Button)(({ theme }) => ({
  ...tertiaryButtonStyles(theme),
  padding: theme.spacing(1.25),
  minWidth: 40,
}));

export const WalletNumber = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
}));

export const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 96,
  height: 96,
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
  fontSize: 18,
  fontWeight: 700,
}));

export const SheetAddress = styled(Typography)(() => ({
  width: '100%',
  wordWrap: 'break-word',
  lineHeight: '20px',
}));

export const ListContainer = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 362,
  paddingBottom: theme.spacing(3),
}));

export const BookmarkButtonContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  position: 'sticky',
  bottom: 0,
  padding: theme.spacing(0, 3, 2),
  marginBottom: theme.spacing(-1.5),
  zIndex: 2,
}));

export const EmptyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: 1,
  gap: theme.spacing(2),
}));

export const EmptyListMessage = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 700,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
}));

export const ValidationAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: 'transparent',
  padding: 0,
  color: theme.palette.text.primary,
  [`.${alertClasses.icon}`]: {
    padding: 0,
    color: theme.palette.error.main,
  },
  [`.${alertClasses.message}`]: { padding: theme.spacing(0.25, 0, 0, 0) },
}));

export const OptionsMenuButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.75),
  right: theme.spacing(2),
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme.palette.mode, '4%'),
  },
}));
