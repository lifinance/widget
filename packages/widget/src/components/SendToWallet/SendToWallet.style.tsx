import { cardHeaderClasses } from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import { CardHeader } from '../Card/CardHeader.js';

export const SendToWalletCardHeader = styled(CardHeader, {
  shouldForwardProp: (prop) => !['selected'].includes(prop as string),
})<{ selected?: boolean }>(({ theme, selected }) => ({
  height: 64,
  [`.${cardHeaderClasses.title}`]: {
    color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 256,
    textAlign: 'left',
    [theme.breakpoints.down(392)]: {
      width: 224,
    },
  },
  [`.${cardHeaderClasses.subheader}`]: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 256,
    textAlign: 'left',
    [theme.breakpoints.down(392)]: {
      width: 224,
    },
  },
}));
