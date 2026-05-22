import type { WidgetVariant } from '@lifi/widget'
import { defaultMaxHeight } from '@lifi/widget'
import { useCallback, useEffect, useState } from 'react'
import type { Layout } from '../store/editTools/types.js'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import { useHeaderAndFooterToolValues } from '../store/editTools/useHeaderAndFooterToolValues.js'
import { useLayoutValues } from '../store/editTools/useLayoutValues.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import {
  useConfigContainer,
  useConfigVariant,
} from '../store/widgetConfig/useConfigValues.js'
import { getLayoutMode } from '../utils/layout.js'

export const usePlaygroundLayoutControls = (): {
  selectedLayoutId: Layout
  setInitialLayout: (layoutId: Layout) => void
  heightValue: number | undefined
  setHeightValue: (height: number | undefined) => void
  variant: WidgetVariant | 'default'
} => {
  const { container } = useConfigContainer()
  const { variant } = useConfigVariant()
  const { showMockHeader } = useHeaderAndFooterToolValues()
  const { setHeader, setContainer, getCurrentConfigTheme, setVariant } =
    useConfigActions()
  const { selectedLayoutId } = useLayoutValues()
  const { setSelectedLayoutId } = useEditToolsActions()
  const [heightValue, setHeightValue] = useState<number | undefined>()

  useEffect(() => {
    setSelectedLayoutId(getLayoutMode(container))
  }, [container, setSelectedLayoutId])

  const setInitialLayout = useCallback(
    (layoutId: Layout) => {
      switch (layoutId) {
        case 'restricted-height': {
          setHeader()

          const heightContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            height: defaultMaxHeight,
            display: undefined,
            maxHeight: undefined,
          }

          setContainer(heightContainer)

          break
        }
        case 'restricted-max-height': {
          setHeader()

          const maxHeightContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            maxHeight: defaultMaxHeight,
            display: undefined,
            height: undefined,
          }

          setContainer(maxHeightContainer)

          break
        }
        case 'full-height': {
          setVariant('compact')

          setHeader({
            position: 'fixed',
            top: showMockHeader ? 48 : 0,
          })

          const fullHeightContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            display: 'flex',
            height: '100%',
            maxHeight: undefined,
          }

          setContainer(fullHeightContainer)
          break
        }
        default: {
          setHeightValue(undefined)
          setHeader()

          const defaultContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            display: undefined,
            height: undefined,
            maxHeight: undefined,
          }

          setContainer(defaultContainer)
        }
      }
    },
    [getCurrentConfigTheme, setContainer, setHeader, setVariant, showMockHeader]
  )

  return {
    selectedLayoutId,
    setInitialLayout,
    heightValue,
    setHeightValue,
    variant,
  }
}
