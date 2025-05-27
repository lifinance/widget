import { debounce, useTheme } from '@mui/material'
import type { RefObject } from 'react'
import { useLayoutEffect, useState } from 'react'
import {
  ElementId,
  getAppContainer,
  getHeaderElement,
  getScrollableContainer,
} from '../utils/elements.js'
import { useDefaultElementId } from './useDefaultElementId.js'

const getContentHeight = (
  elementId: string,
  listParentRef: RefObject<HTMLUListElement | HTMLDivElement | null>
) => {
  const containerElement = getScrollableContainer(elementId)

  const headerElement = getHeaderElement(elementId)

  const listParentElement = listParentRef?.current

  let oldHeight: string | undefined = undefined

  // This covers the case where in full height flex mode when the browser height is reduced
  // - this allows a virtualised list to be made smaller
  if (listParentElement) {
    oldHeight = listParentElement.style.height
    listParentElement.style.height = '0'
  }

  if (!containerElement || !headerElement) {
    console.warn(
      `Can't find ${ElementId.ScrollableContainer} or ${ElementId.Header} id.`
    )
    return 0
  }
  const { height: containerHeight } = containerElement.getBoundingClientRect()
  const { height: headerHeight } = headerElement.getBoundingClientRect()

  // This covers the case where in full height flex mode when the browser height is reduced the
  // - this allows a virtualised list to be set to minimum size
  if (listParentElement && oldHeight) {
    listParentElement.style.height = oldHeight
  }

  return containerHeight - headerHeight
}

interface UseContentHeightProps {
  listParentRef: RefObject<HTMLUListElement | HTMLDivElement | null>
  headerRef?: RefObject<HTMLElement | null>
}

export const defaultMinListHeight = 360
export const minMobileListHeight = 160

// NOTE: this hook is implicitly tied to the widget height functionality in the
//   AppExpandedContainer, RelativeContainer and CssBaselineContainer components as defined in AppContainer.ts
//   CSS changes in those components can have implications for the functionality in this hook

export const useListHeight = ({
  listParentRef,
  headerRef,
}: UseContentHeightProps) => {
  const elementId = useDefaultElementId()
  const [contentHeight, setContentHeight] = useState<number>(0)
  const theme = useTheme()

  useLayoutEffect(() => {
    const handleResize = () => {
      setContentHeight(getContentHeight(elementId, listParentRef))
    }

    const processResize = debounce(() => handleResize(), 40)

    // calling this on initial mount prevents the lists resizing appearing glitchy
    handleResize()

    const appContainer = getAppContainer(elementId)

    let resizeObserver: ResizeObserver
    if (appContainer) {
      resizeObserver = new ResizeObserver(processResize)
      resizeObserver.observe(appContainer)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [elementId, listParentRef])

  if (theme.container?.height === 'fit-content') {
    return {
      minListHeight: 'fit-content',
      listHeight: 'fit-content',
    }
  }

  const minListHeight =
    theme.container?.height === '100%'
      ? minMobileListHeight
      : defaultMinListHeight

  const listHeight = Math.max(
    contentHeight - (headerRef?.current?.offsetHeight ?? 0),
    minListHeight
  )

  return {
    minListHeight,
    listHeight,
  }
}
