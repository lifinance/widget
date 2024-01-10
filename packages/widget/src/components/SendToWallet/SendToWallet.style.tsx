import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CardHeader } from '../Card';
import { cardHeaderClasses } from '@mui/material/CardHeader';

export const SendToWalletCardHeader = styled(CardHeader, {
  shouldForwardProp: (prop) =>
    !['selected', 'compact'].includes(prop as string),
})<{ selected?: boolean }>(({ theme, selected }) => ({
  height: 64,
  [`.${cardHeaderClasses.title}`]: {
    color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 256,
    fontWeight: selected ? 500 : 400,
    fontSize: !selected ? '1rem' : '1.125rem',
    [theme.breakpoints.down(392)]: {
      width: 224,
    },
  },
  [`.${cardHeaderClasses.subheader}`]: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 256,
    [theme.breakpoints.down(392)]: {
      width: 224,
    },
  },
}));

export const WalletAvatarBase = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '40px',
  height: '40px',
  background:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  borderRadius: '50%',
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
