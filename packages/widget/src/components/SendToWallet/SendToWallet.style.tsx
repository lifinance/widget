import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CardHeader } from '../Card';
import { cardHeaderClasses } from '@mui/material/CardHeader';

export const SendToWalletCardHeader = styled(CardHeader, {
  shouldForwardProp: (prop) =>
    !['selected', 'compact'].includes(prop as string),
})<{ selected?: boolean; compact?: boolean }>(
  ({ theme, selected, compact }) => ({
    height: 64,
    [`.${cardHeaderClasses.title}`]: {
      color: selected
        ? theme.palette.text.primary
        : theme.palette.text.secondary,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: compact ? 92 : 256,
      fontWeight: selected ? 500 : 400,
      fontSize: compact && !selected ? '1rem' : '1.125rem',
      [theme.breakpoints.down(392)]: {
        width: compact ? 92 : 224,
      },
    },
    [`.${cardHeaderClasses.subheader}`]: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: compact ? 92 : 256,
      [theme.breakpoints.down(392)]: {
        width: compact ? 92 : 224,
      },
    },
  }),
);

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
