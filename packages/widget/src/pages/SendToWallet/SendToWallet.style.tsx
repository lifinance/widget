import {
  InputBase,
  Box,
  Button,
  Typography,
  IconButton,
  Theme,
  ButtonBase,
} from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { Card } from '../../components/Card';
import Menu, { MenuProps } from '@mui/material/Menu';

export const NameInput = styled(InputBase)(({ theme }) => ({
  alignItems: 'start',
  [`.${inputBaseClasses.input}`]: {
    fontWeight: 500,
    lineHeight: '20px',
    paddingBottom: 0,
  },
}));
export const AddressInput = styled(NameInput)(({ theme }) => ({
  minHeight: '64px',
}));

export const BookmarkInputFields = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}));

//  TODO: Question : should this be using the PageContainer component instead?
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
  flexGrow: 1,
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

// TODO: Question: do we really need this?
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

export const IconContainer = styled(Box)(({ theme }) => ({
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

export const ListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '362px',
}));

export const ListItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

export const ListItemButton = styled(ButtonBase)(({ theme }) => ({
  background: 'none',
  color: 'inherit',
  border: 'none',
  font: 'inherit',
  cursor: 'pointer',
  outline: 'inherit',
  display: 'flex',
  flexGrow: 1,
  margin: 0,
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: theme.spacing(1),
  gap: theme.spacing(1.5),
}));
export const ListItemMenuButton = styled(IconButton)(({ theme }) => ({
  background: 'none',
  color: 'inherit',
  border: 'none',
  font: 'inherit',
  cursor: 'pointer',
  outline: 'inherit',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 0,
  height: 40,
  padding: theme.spacing(1),
  '&:hover': {
    background: 'none',
  },
}));

export const ListMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.shape.borderRadius,
    minWidth: 256,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: theme.spacing(3),
    },
    '& .MuiMenuItem-root': {
      paddingLeft: 0,
      paddingRight: 0,
      '& .MuiSvgIcon-root': {
        fontSize: 24,
        color: theme.palette.text.primary,
        marginRight: theme.spacing(1.5),
      },
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
}));

export const BookmarkItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.5),
  maxWidth: '240px',
  overflowX: 'hidden',
}));

export const BookmarkName = styled(Typography)(() => ({
  fontSize: '18px',
  fontWeight: 500,
  lineHeight: '24px',
}));

export const BookmarkAddress = styled(Typography)(() => ({
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '16px',
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
  fontSize: '14px',
  fontWeight: 700,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
}));
