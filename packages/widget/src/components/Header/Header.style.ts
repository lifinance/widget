import { AppBar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HeaderAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'pt',
})<{ pt?: number }>(({ theme, pt }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  minHeight: 48,
  padding: theme.spacing(pt ?? 0, 3, 0, 3),
}));

export const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sticky',
})<{ sticky?: boolean }>(({ theme, sticky }) => ({
  backgroundColor: theme.palette.background.default,
  position: sticky ? 'sticky' : 'relative',
  top: 0,
  zIndex: 1200,
}));
