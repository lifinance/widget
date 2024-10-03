import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FormControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  minWidth: 568,
}));

export const FormValueGroupContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));
