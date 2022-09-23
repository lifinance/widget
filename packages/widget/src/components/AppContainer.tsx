import { Box, Container, ScopedCssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { PropsWithChildren, RefObject } from 'react';
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWidgetConfig } from '../providers';
import type { WidgetVariant } from '../types';
import { ElementId } from '../utils';

export const maxHeight = 680;

const ExpandedContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ variant }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  flex: 1,
  height: variant === 'drawer' ? 'none' : maxHeight,
}));

const RelativeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ theme, variant }) => ({
  position: 'relative',
  width: '100%',
  minWidth: 375,
  maxWidth: 392,
  maxHeight: variant === 'drawer' ? 'none' : maxHeight,
  background: theme.palette.background.default,
  overflow: 'auto',
  flex: 1,
  boxSizing: 'border-box',
  zIndex: 0,
}));

const CssBaselineContainer = styled(ScopedCssBaseline, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ variant }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  overflowX: 'clip',
  margin: 0,
  width: '100%',
  maxHeight: variant === 'drawer' ? 'none' : maxHeight,
}));

export const FlexContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

export const AppContainer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  // const ref = useRef<HTMLDivElement>(null);
  const { containerStyle, variant } = useWidgetConfig();
  return (
    <RelativeContainer sx={containerStyle} variant={variant}>
      <CssBaselineContainer
        variant={variant}
        id={ElementId.ScrollableContainer}
        // ref={ref}
        enableColorScheme
      >
        <FlexContainer disableGutters>{children}</FlexContainer>
      </CssBaselineContainer>
      {/* <ScrollToLocation elementRef={ref} /> */}
    </RelativeContainer>
  );
};

export const AppExpandedContainer: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return <ExpandedContainer>{children}</ExpandedContainer>;
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
