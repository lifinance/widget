import { Stack as MuiStack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Stack = styled(MuiStack)(({ theme }) => ({
  alignItems: 'stretch',
  display: 'flex',
  flex: 1,
  flexWrap: 'nowrap',
  overflow: 'hidden',
  padding: theme.spacing(2),
}));
