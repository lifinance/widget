import {
  Alert,
  Box,
  IconButton,
  List,
  Typography,
  alertClasses,
  inputBaseClasses,
  styled,
} from '@mui/material';
import { ButtonTertiary } from '../../components/ButtonTertiary.js';
import { Card } from '../../components/Card/Card.js';
import { Input } from '../../components/Input.js';
import type { PageContainerProps } from '../../components/PageContainer.js';
import { PageContainer } from '../../components/PageContainer.js';
import { getContrastAlphaColor } from '../../utils/colors.js';

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

export const SendToWalletCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
});

export const SendToWalletSheetContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4, 3, 3),
  gap: theme.spacing(2),
}));

export const SendToWalletButtonRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: theme.spacing(1),
}));

export const SendToWalletIconButton = styled(ButtonTertiary)(({ theme }) => ({
  padding: theme.spacing(1.25),
  minWidth: 40,
}));

export const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 80,
  height: 80,
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

export const SheetAddressContainer = styled(Box)(() => ({
  width: '100%',
  wordWrap: 'break-word',
}));

export const ListContainer = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 400,
  paddingBottom: theme.spacing(1.5),
}));

export const BookmarkButtonContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  position: 'sticky',
  bottom: 0,
  padding: theme.spacing(0, 3, 3),
  marginBottom: theme.spacing(-5.25),
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
    backgroundColor: getContrastAlphaColor(theme, 0.04),
  },
}));
