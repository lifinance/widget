import { Box, Container, ScopedCssBaseline, styled } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { defaultMaxHeight } from '../config/constants.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import type { WidgetVariant } from '../types/widget.js';
import { ElementId, createElementId } from '../utils/elements.js';

export const AppExpandedContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ theme, variant }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  flex: 1,
  height:
    variant === 'drawer'
      ? 'none'
      : theme.container?.display === 'flex'
        ? '100%'
        : theme.container?.maxHeight
          ? theme.container?.maxHeight
          : theme.container?.height || defaultMaxHeight,
}));

export const RelativeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ theme, variant }) => ({
  position: 'relative',
  boxSizing: 'content-box',
  width: '100%',
  minWidth: theme.breakpoints.values.xs,
  maxWidth: theme.breakpoints.values.sm,
  maxHeight:
    variant === 'drawer'
      ? 'none'
      : theme.container?.display === 'flex' && !theme.container?.height
        ? '100%'
        : theme.container?.maxHeight
          ? theme.container?.maxHeight
          : theme.container?.height || defaultMaxHeight,
  background: theme.palette.background.default,
  overflow: 'auto',
  flex: 1,
  zIndex: 0,
  ...theme.container,
}));

const CssBaselineContainer = styled(ScopedCssBaseline, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ theme, variant }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  overflowX: 'clip',
  margin: 0,
  width: '100%',
  maxHeight:
    variant === 'drawer' || theme.container?.display === 'flex'
      ? 'none'
      : theme.container?.maxHeight
        ? theme.container?.maxHeight
        : theme.container?.height || defaultMaxHeight,
  overflowY: 'auto',
  height: theme.container?.display === 'flex' ? 'auto' : '100%',
}));

export const FlexContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

export const AppContainer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  // const ref = useRef<HTMLDivElement>(null);
  const { variant, elementId } = useWidgetConfig();
  return (
    <RelativeContainer
      variant={variant}
      id={createElementId(ElementId.RelativeContainer, elementId)}
    >
      <CssBaselineContainer
        id={createElementId(ElementId.ScrollableContainer, elementId)}
        variant={variant}
        enableColorScheme
        // ref={ref}
      >
        <FlexContainer disableGutters>{children}</FlexContainer>
      </CssBaselineContainer>
      {/* <ScrollToLocation elementRef={ref} /> */}
    </RelativeContainer>
  );
};

// export const ScrollToLocation: React.FC<{
//   elementRef: RefObject<HTMLElement>;
// }> = ({ elementRef }) => {
//   const { pathname } = useLocation();
//   useLayoutEffect(() => {
//     elementRef.current?.scrollTo(0, 0);
//   }, [elementRef, pathname]);
//   return null;
// };
