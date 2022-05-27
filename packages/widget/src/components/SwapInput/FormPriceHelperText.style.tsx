import { FormHelperText as MuiFormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FormHelperText = styled(MuiFormHelperText)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: 0,
}));
