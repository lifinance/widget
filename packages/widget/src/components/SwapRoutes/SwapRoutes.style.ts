import { Box, ScopedCssBaseline, Stack as MuiStack } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { maxHeight } from '../AppContainer';

export const CollapseContainer = styled(Box)(({ theme }) => ({
  height: maxHeight,
  zIndex: 0,
}));

export const ScrollableContainer = styled(Box)({
  overflowY: 'auto',
  height: '100%',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

export const Container = styled(ScopedCssBaseline)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  overflow: 'auto',
  width: 436,
  maxHeight,
  marginLeft: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
}));

export const Header = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.84),
  backdropFilter: 'blur(12px)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 3),
  position: 'sticky',
  top: 0,
  zIndex: 1200,
}));

export const Stack = styled(MuiStack)(({ theme }) => ({
  alignItems: 'stretch',
  display: 'flex',
  flex: 1,
  flexWrap: 'nowrap',
  overflow: 'hidden',
  borderRight: `solid ${
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800]
  }`,
  width: 'calc(100% - 48px)',
}));
