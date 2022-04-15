import { Box, BoxProps, Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PropsWithChildren, RefObject, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ElementId } from '../utils/elements';

const Container = styled(MuiContainer)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  height: '100%',
  display: 'flex',
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
  background: theme.palette.common.white,
  overflow: 'auto',
}));

const ScrollableContainer = styled(Box)({
  // position: 'fixed',
  overflowY: 'scroll',
  height: '100%',
  flex: 1,
});

export const MainContainer: React.FC<PropsWithChildren<BoxProps>> = ({
  children,
  sx,
}) => {
  const ref = useRef<HTMLElement>(null);
  return (
    <>
      <RelativeContainer sx={sx}>
        <ScrollableContainer id={ElementId.ScrollableContainer} ref={ref}>
          <Container maxWidth={false} disableGutters>
            {children}
          </Container>
        </ScrollableContainer>
      </RelativeContainer>
      <ScrollToLocation elementRef={ref} />
    </>
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
