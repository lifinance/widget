import { CardHeader as MuiCardHeader } from '@mui/material';
import { cardHeaderClasses } from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';

export const CardHeader = styled(MuiCardHeader)(({ theme }) => ({
  [`.${cardHeaderClasses.action}`]: {
    marginTop: -2,
    alignSelf: 'center',
  },
  [`.${cardHeaderClasses.title}`]: {
    fontWeight: '500',
    fontSize: '1.125rem',
    lineHeight: '1.2778',
    color: theme.palette.text.primary,
  },
  [`.${cardHeaderClasses.subheader}`]: {
    fontWeight: '400',
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
}));
