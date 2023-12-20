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
      fontWeight: 500,
      lineHeight: 1.3334,
      fontSize: compact && !selected ? 16 : 18,
      [theme.breakpoints.down(392)]: {
        width: compact ? 92 : 224,
      },
    },
    [`.${cardHeaderClasses.subheader}`]: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      fontWeight: 500,
      lineHeight: 1.3334,
      width: compact ? 92 : 256,
      [theme.breakpoints.down(392)]: {
        width: compact ? 92 : 224,
      },
    },
  }),
);
