import { styled } from '@mui/material/styles';
import { ListItemButton as ListItemButtonBase } from '../ListItemButton';
export const ListItemButton = styled(ListItemButtonBase)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  height: 64,
  width: '100%',
}));
