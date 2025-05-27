import { Box, Container, ScopedCssBaseline, styled } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { defaultMaxHeight } from '../config/constants.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useHeaderHeight } from '../stores/header/useHeaderStore.js'
import type { WidgetVariant } from '../types/widget.js'
import { ElementId, createElementId } from '../utils/elements.js'

// NOTE: the setting of the height in AppExpandedContainer, RelativeContainer and CssBaselineContainer can
//  be done dynamically by values in the config - namely the config.theme.container values display, maxHeight and height
//  A Number of other components and hooks work with height values that are often set on or derived from these elements
//  if there are changes to how the height works here you should also check the functionality of these hooks and their point of use
//    - useTokenListHeight
//    - useSetContentHeight
//  Also check any code that is using the methods from elements.ts utils file

export const AppExpandedContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'isListPage',
})<{ variant?: WidgetVariant; isListPage: boolean }>(
  ({ theme, isListPage }) => {
    const maxHeight = isListPage
      ? theme.container?.listPageMaxHeight
      : theme.container?.maxHeight
    return {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'start',
      flex: 1,
      height:
        theme.container?.display === 'flex'
          ? '100%'
          : maxHeight
            ? 'auto'
            : theme.container?.height || 'auto',
      variants: [
        {
          props: {
            variant: 'drawer',
          },
          style: {
            height: 'none',
          },
        },
      ],
    }
  }
)

export const RelativeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'isListPage',
})<{ variant?: WidgetVariant; isListPage: boolean }>(
  ({ theme, isListPage }) => {
    const maxHeight = isListPage
      ? theme.container?.listPageMaxHeight
      : theme.container?.maxHeight
    return {
      position: 'relative',
      boxSizing: 'content-box',
      width: '100%',
      minWidth: theme.breakpoints.values.xs,
      maxWidth: theme.breakpoints.values.sm,
      background: theme.vars.palette.background.default,
      overflow: 'auto',
      flex: 1,
      zIndex: 0,
      ...theme.container,
      maxHeight:
        theme.container?.display === 'flex' && !theme.container?.height
          ? '100%'
          : (maxHeight ?? theme.container?.height ?? defaultMaxHeight),
      variants: [
        {
          props: {
            variant: 'drawer',
          },
          style: {
            maxHeight: 'none',
            height: '100%',
            boxShadow: 'none',
          },
        },
      ],
    }
  }
)

interface CssBaselineContainerProps {
  variant?: WidgetVariant
  paddingTopAdjustment: number
  elementId: string
  isListPage: boolean
}

const CssBaselineContainer = styled(ScopedCssBaseline, {
  shouldForwardProp: (prop) =>
    !['variant', 'paddingTopAdjustment', 'elementId', 'isListPage'].includes(
      prop as string
    ),
})<CssBaselineContainerProps>(
  ({ theme, variant, paddingTopAdjustment, isListPage }) => {
    const fullContainerHeight = theme.container?.maxHeight
      ? theme.container?.maxHeight
      : theme.container?.height || defaultMaxHeight
    const listPageMaxHeight = theme.container?.listPageMaxHeight
      ? theme.container?.listPageMaxHeight
      : theme.container?.height || defaultMaxHeight
    const maxHeight = isListPage ? listPageMaxHeight : fullContainerHeight
    return {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      overflowX: 'clip',
      margin: 0,
      width: '100%',
      maxHeight:
        variant === 'drawer' || theme.container?.display === 'flex'
          ? 'none'
          : maxHeight,
      overflowY: 'auto',
      height: theme.container?.display === 'flex' ? 'auto' : '100%',
      paddingTop: paddingTopAdjustment,
      // This allows FullPageContainer.tsx to expand and fill the available vertical space in max height and default layout modes
      '&:has(.full-page-container)': {
        height: maxHeight,
      },
    }
  }
)

export const FlexContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
})

export const AppContainer: React.FC<
  PropsWithChildren & { isListPage: boolean }
> = ({ children, isListPage }) => {
  // const ref = useRef<HTMLDivElement>(null);
  const { variant, elementId, theme } = useWidgetConfig()
  const { headerHeight } = useHeaderHeight()
  const positionFixedAdjustment =
    theme?.header?.position === 'fixed' ? headerHeight : 0

  return (
    <RelativeContainer
      variant={variant}
      id={createElementId(ElementId.RelativeContainer, elementId)}
      isListPage={isListPage}
    >
      <CssBaselineContainer
        id={createElementId(ElementId.ScrollableContainer, elementId)}
        variant={variant}
        enableColorScheme
        paddingTopAdjustment={positionFixedAdjustment}
        elementId={elementId}
        isListPage={isListPage}
        // ref={ref}
      >
        <FlexContainer disableGutters>{children}</FlexContainer>
      </CssBaselineContainer>
      {/* <ScrollToLocation elementRef={ref} /> */}
    </RelativeContainer>
  )
}

// export const ScrollToLocation: React.FC<{
//   elementRef: RefObject<HTMLElement>;
// }> = ({ elementRef }) => {
//   const { pathname } = useLocation();
//   useLayoutEffect(() => {
//     elementRef.current?.scrollTo(0, 0);
//   }, [elementRef, pathname]);
//   return null;
// };
