import { Card as MuiCard } from '@mui/material';
import { cardHeaderClasses } from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import { CardHeader } from '../Card';

export const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 0,
  '&:hover': {
    cursor: 'pointer',
  },
}));

export const SelectTokenCardHeader = styled(CardHeader, {
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
      width: compact ? 92 : 224,
    },
    [`.${cardHeaderClasses.subheader}`]: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: compact ? 92 : 224,
    },
  }),
);
