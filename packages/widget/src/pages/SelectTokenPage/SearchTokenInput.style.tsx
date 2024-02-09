import { styled } from '@mui/material';
import { Input as InputBase } from '../../components/Input.js';

export const Input = styled(InputBase)(({ theme }) => ({
  paddingRight: theme.spacing(1.5),
}));
