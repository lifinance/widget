import type { ScopedCssBaselineProps } from '@mui/material';
import { Box, Collapse, Grow, ScopedCssBaseline, styled } from '@mui/material';
import { defaultMaxHeight } from '../../config/constants.js';

export const CollapseContainer = styled(Box)(({ theme }) => ({
  zIndex: 0,
  ...(theme.container.display === 'flex'
    ? { display: 'flex', maxHeight: '100%' }
    : { height: 'auto' }),
}));

export const RoutesExpandedCollapse = styled(Collapse)(({ theme }) => ({
  ...(theme.container?.display === 'flex' ? { height: '100%' } : {}),
}));

export const RouteTopLevelGrow = styled(Grow)(({ theme }) => ({
  ...(theme.container?.display === 'flex' ? { height: '100%' } : {}),
}));

export const RouteNestedGrow = styled(Grow)(({ theme }) => ({
  ...(!theme.container?.height && !theme.container?.maxHeight
    ? { height: defaultMaxHeight }
    : {}),
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
  minimumHeight: boolean;
}

export const Container = styled(ScopedCssBaseline, {
  shouldForwardProp: (prop) => !['minimumHeight'].includes(prop as string),
})<ContainerProps>(({ theme, minimumHeight }) => ({
  backgroundColor: theme.palette.background.default,
  overflow: 'auto',
  width: 436,
  marginLeft: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  ...(theme.container?.display !== 'flex'
    ? {
        maxHeight:
          theme.container?.maxHeight ??
          theme.container?.height ??
          defaultMaxHeight,
        ...(minimumHeight ? { '&': { height: 'auto' } } : {}),
      }
    : { height: minimumHeight ? 'auto' : '100%' }),
  ...theme.container,
}));

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
