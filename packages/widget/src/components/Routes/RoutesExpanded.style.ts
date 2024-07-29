import type { ScopedCssBaselineProps } from '@mui/material';
import { Box, Collapse, Grow, ScopedCssBaseline, styled } from '@mui/material';
import { maxHeight } from '../AppContainer.js';

export const CollapseContainer = styled(Box)(({ theme }) => ({
  zIndex: 0,
  ...(theme.container.display === 'flex'
    ? { display: 'flex', maxHeight: '100%' }
    : { height: maxHeight }),
}));

export const RoutesExpandedCollapse = styled(Collapse)(({ theme }) => ({
  ...(theme.container?.display === 'flex' ? { height: '100%' } : {}),
}));

export const RouteGrow = styled(Grow)(({ theme }) => ({
  ...(theme.container?.display === 'flex' ? { height: '100%' } : {}),
}));

export const ScrollableContainer = styled(Box)({
  overflowY: 'auto',
  height: '100%',
  width: '100%',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

interface ContainerProps extends ScopedCssBaselineProps {
  isLoading: boolean;
}

export const Container = styled(ScopedCssBaseline)<ContainerProps>(
  ({ theme, isLoading }) => ({
    backgroundColor: theme.palette.background.default,
    overflow: 'auto',
    width: 436,
    marginLeft: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    ...(theme.container?.display !== 'flex'
      ? { maxHeight }
      : { height: isLoading ? 'auto' : '100%' }),
    ...theme.container,
  }),
);

export const Header = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  backdropFilter: 'blur(12px)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 3),
  position: 'sticky',
  top: 0,
  zIndex: 1200,
}));
