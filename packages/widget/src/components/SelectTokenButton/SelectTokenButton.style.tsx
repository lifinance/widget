import { cardHeaderClasses } from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import { CardHeader } from '../Card';

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
