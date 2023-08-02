import { Stack as MuiStack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Stack: any = styled(MuiStack)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1, 3),
}));
