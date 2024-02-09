import {
  CardHeader as MuiCardHeader,
  cardHeaderClasses,
  styled,
} from '@mui/material';

export const CardHeader = styled(MuiCardHeader)(({ theme }) => ({
  [`.${cardHeaderClasses.action}`]: {
    marginTop: -2,
    alignSelf: 'center',
  },
  [`.${cardHeaderClasses.title}`]: {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: 1.3334,
    color: theme.palette.text.primary,
  },
  [`.${cardHeaderClasses.subheader}`]: {
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 1.3334,
    color: theme.palette.text.secondary,
  },
}));
