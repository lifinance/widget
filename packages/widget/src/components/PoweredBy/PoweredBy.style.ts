import { Link as MuiLink, styled } from '@mui/material';

export const Link = styled(MuiLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: 'none',
  ':hover': {
    color: theme.palette.primary.main,
  },
}));
