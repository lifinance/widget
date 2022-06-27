import { Link as MuiLink } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Link = styled(MuiLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  ':hover': {
    color: theme.palette.primary.main,
  },
}));
