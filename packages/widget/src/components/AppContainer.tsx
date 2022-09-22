import { Box, Container, ScopedCssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { PropsWithChildren, RefObject } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useWidgetConfig } from '../providers';
import type { WidgetVariant } from '../types';
import { ElementId } from '../utils';

const maxHeight = 640;

const ExpandedContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  flex: 1,
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

const ScrollableContainer = styled(Box)({
  overflowY: 'auto',
  height: '100%',
  flex: 1,
  display: 'flex',
});

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
  flexBasis: 'auto',
  flexDirection: 'column',
  flexShrink: 0,
  flexGrow: 1,
});

export const AppContainer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const ref = useRef<HTMLElement>(null);
  const { containerStyle, variant } = useWidgetConfig();
  return (
    <RelativeContainer sx={containerStyle} variant={variant}>
      <ScrollableContainer id={ElementId.ScrollableContainer} ref={ref}>
        <CssBaselineContainer variant={variant} enableColorScheme>
          <FlexContainer disableGutters>{children}</FlexContainer>
        </CssBaselineContainer>
      </ScrollableContainer>
      <ScrollToLocation elementRef={ref} />
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
