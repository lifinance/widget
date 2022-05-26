import {
  Box,
  BoxProps,
  Container as MuiContainer,
  ScopedCssBaseline,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { PropsWithChildren, RefObject, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ElementId } from '../utils/elements';
import { PoweredBy } from './PoweredBy';

const Container = styled(MuiContainer)(({ theme }) => ({
  // height: '100%',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  overflowX: 'clip',
  marginRight: 0,
  [theme.breakpoints.up('xs')]: {
    maxWidth: 480,
  },
}));

const RelativeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '480px',
  background: theme.palette.background.default,
  overflow: 'auto',
}));

const ScrollableContainer = styled(Box)({
  // position: 'fixed',
  overflowY: 'scroll',
  height: '100%',
  flex: 1,
  display: 'flex',
});

export const AppContainer: React.FC<PropsWithChildren<BoxProps>> = ({
  children,
  sx,
  style,
}) => {
  const ref = useRef<HTMLElement>(null);
  return (
    <ScopedCssBaseline enableColorScheme style={style}>
      <RelativeContainer sx={sx}>
        <ScrollableContainer id={ElementId.ScrollableContainer} ref={ref}>
          <Container maxWidth={false} disableGutters>
            {children}
            <PoweredBy />
          </Container>
        </ScrollableContainer>
      </RelativeContainer>
      <ScrollToLocation elementRef={ref} />
    </ScopedCssBaseline>
  );
};

export const ScrollToLocation: React.FC<{
  elementRef: RefObject<HTMLElement>;
}> = ({ elementRef }) => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    elementRef.current?.scrollTo(0, 0);
  }, [elementRef, pathname]);
  return null;
};
