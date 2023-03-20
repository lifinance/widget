import { ListItemText as MuiListItemText } from '@mui/material';
import { listItemTextClasses } from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import { ListItemButton as ListItemButtonBase } from '../../components/ListItemButton';

export const ListItemButton = styled(ListItemButtonBase)(({ theme }) => ({
  height: 48,
  paddingRight: theme.spacing(0.5),
}));

export const ListItemText = styled(MuiListItemText)({
  [`.${listItemTextClasses.primary}`]: {
    fontWeight: 400,
    fontSize: '1rem',
  },
});
