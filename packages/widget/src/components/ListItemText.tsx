import {
  listItemTextClasses,
  ListItemText as MuiListItemText,
  styled,
} from '@mui/material';

export const ListItemText = styled(MuiListItemText)(({ theme }) => ({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 500,
  },
}));
