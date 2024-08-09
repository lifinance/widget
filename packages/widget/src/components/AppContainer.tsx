import { Box, Container, ScopedCssBaseline, styled } from '@mui/material';
import type { PropsWithChildren } from 'react';
import {
  maxHeaderHeight,
  minHeaderHeight,
} from '../components/Header/Header.js';
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
          ? 'auto'
          : theme.container?.height || 'auto',
}));

export const RelativeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: WidgetVariant }>(({ theme, variant }) => {
  const container = { ...theme.container };

  if (variant === 'drawer') {
    container.height = '100%';
  }

  return {
    position: 'relative',
    boxSizing: 'content-box',
    width: '100%',
    minWidth: theme.breakpoints.values.xs,
    maxWidth: theme.breakpoints.values.sm,
    background: theme.palette.background.default,
    overflow: 'auto',
    flex: 1,
    zIndex: 0,
    ...container,
    maxHeight:
      variant === 'drawer'
        ? 'none'
        : theme.container?.display === 'flex' && !theme.container?.height
          ? '100%'
          : theme.container?.maxHeight
            ? theme.container?.maxHeight
            : theme.container?.height || defaultMaxHeight,
  };
});

interface CssBaselineContainerProps {
  variant?: WidgetVariant;
  paddingTopAdjustment: number;
}

const CssBaselineContainer = styled(ScopedCssBaseline, {
  shouldForwardProp: (prop) =>
    !['variant', 'paddingTopAdjustment'].includes(prop as string),
})<CssBaselineContainerProps>(({ theme, variant, paddingTopAdjustment }) => ({
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
  paddingTop: paddingTopAdjustment,
}));

export const FlexContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));

export const AppContainer: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  // const ref = useRef<HTMLDivElement>(null);
  const { variant, elementId, hiddenUI, theme } = useWidgetConfig();

  const positionFixedAdjustment =
    theme?.header?.position === 'fixed'
      ? hiddenUI?.includes('walletMenu')
        ? minHeaderHeight
        : maxHeaderHeight
      : 0;

  return (
    <RelativeContainer
      variant={variant}
      id={createElementId(ElementId.RelativeContainer, elementId)}
    >
      <CssBaselineContainer
        id={createElementId(ElementId.ScrollableContainer, elementId)}
        variant={variant}
        enableColorScheme
        paddingTopAdjustment={positionFixedAdjustment}
        // ref={ref}
      >
        <FlexContainer disableGutters id="app-level-flex-container">
          {children}
        </FlexContainer>
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
