import { styled } from '@mui/material/styles';
import { Input as InputBase } from '../../components/Input';

export const Input: any = styled(InputBase)(({ theme }) => ({
  paddingRight: theme.spacing(1.5),
}));
