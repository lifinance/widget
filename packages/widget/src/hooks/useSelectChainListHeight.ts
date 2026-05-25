import { type Theme, useTheme } from '@mui/material'
import type { RefObject } from 'react'
import { useMemo } from 'react'
import { getWidgetMaxHeight } from '../utils/widgetSize.js'
import { useListHeight } from './useListHeight.js'

const expandedSearchHeaderHeight = '80px'

function getExpansionListContainerHeight(theme: Theme): string {
  const fullContainerHeight = getWidgetMaxHeight(theme)
  const heightValue =
    typeof fullContainerHeight === 'number'
      ? `${fullContainerHeight}px`
      : fullContainerHeight
  return `calc(${heightValue} - ${expandedSearchHeaderHeight})`
}

export const useSelectChainListHeight = (
  inExpansion: boolean,
  listRef: RefObject<HTMLDivElement | null>,
  headerRef: RefObject<HTMLElement | null>
): number | string => {
  const theme = useTheme()
  const { listHeight } = useListHeight({
    listParentRef: listRef,
    headerRef: inExpansion ? undefined : headerRef,
  })
  const expansionListContainerHeight = useMemo(
    () => getExpansionListContainerHeight(theme),
    [theme]
  )

  return inExpansion ? expansionListContainerHeight : listHeight
}
