import { ListItemText as MuiListItemText } from '@mui/material';
import { listItemTextClasses } from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';

export const ListItemText: any = styled(MuiListItemText)(({ theme }) => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 400,
  },
}));
