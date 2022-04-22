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
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  [`& .${cardHeaderClasses.title}`]: {
    color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
  },
}));
