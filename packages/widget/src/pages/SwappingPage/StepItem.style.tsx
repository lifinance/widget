import { Stack as MuiStack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Stack = styled(MuiStack)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3, 3),
}));
