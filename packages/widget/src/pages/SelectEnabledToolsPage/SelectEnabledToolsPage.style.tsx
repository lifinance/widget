import { styled } from '@mui/material/styles';
import { ListItemButton as ListItemButtonBase } from '../../components/ListItemButton';

export const ListItemButton: any = styled(ListItemButtonBase)(({ theme }) => ({
  paddingRight: theme.spacing(1),
}));
