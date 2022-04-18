import { Card as MuiCard } from '@mui/material';
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
  [`& .${cardHeaderClasses.action}`]: {
    marginTop: 0,
    alignSelf: 'center',
  },
}));
