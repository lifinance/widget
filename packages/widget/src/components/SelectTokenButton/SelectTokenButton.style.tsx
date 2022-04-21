import { Card as MuiCard, CardHeader as MuiCardHeader } from '@mui/material';
import { cardHeaderClasses } from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import { SwapFormDirection } from '../../providers/SwapFormProvider';

export const Card = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'formType',
})<{ formType?: SwapFormDirection }>(({ theme, formType }) => ({
  borderRadius: 0,
  '&:hover': {
    cursor: 'pointer',
  },
}));

export const CardHeader = styled(MuiCardHeader, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  height: '40px',
  [`& .${cardHeaderClasses.action}`]: {
    marginTop: -2,
    alignSelf: 'center',
  },
  [`& .${cardHeaderClasses.title}`]: {
    fontWeight: '500',
    fontSize: '1.125rem',
    lineHeight: '1.3334',
    color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
  },
  [`& .${cardHeaderClasses.subheader}`]: {
    fontWeight: '400',
    fontSize: '0.75rem',
    lineHeight: '1.3334',
  },
}));
