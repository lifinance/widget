import { AppBar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  minHeight: 40,
  padding: theme.spacing(0, 3, 0, 3),
  ':first-of-type': {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

export const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sticky',
})<{ sticky?: boolean }>(({ theme, sticky }) => ({
  backgroundColor: theme.palette.background.default,
  position: sticky ? 'sticky' : 'relative',
  top: 0,
  zIndex: 1200,
}));
