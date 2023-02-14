import { styled } from '@mui/material/styles';
import { ListItemButton as ListItemButtonBase } from '../../components/ListItemButton';

export const ListItemButton = styled(ListItemButtonBase)(({ theme }) => ({
  paddingRight: theme.spacing(1),
}));
