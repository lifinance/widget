import { Stack as MuiStack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Stack = styled(MuiStack)(({ theme }) => ({
  alignItems: 'stretch',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  overflow: 'hidden',
  padding: theme.spacing(2),
}));
