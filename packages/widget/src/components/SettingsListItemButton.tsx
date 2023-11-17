import { styled } from '@mui/material/styles';
import { ListItemButton as ListItemButtonBase } from './ListItemButton';

export const SettingsListItemButton = styled(ListItemButtonBase)(
  ({ theme }) => ({
    paddingRight: theme.spacing(1),
  }),
);
