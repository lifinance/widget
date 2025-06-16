import { defaultMaxHeight } from '@lifi/widget'
import { type FocusEventHandler, useCallback } from 'react'
import type { Layout } from '../../../../store/editTools/types'
import { useConfigActions } from '../../../../store/widgetConfig/useConfigActions'
import {
  CapitalizeFirstLetter,
  ControlRowContainer,
  PlaygroundControlsContainer,
} from '../DesignControls.style'
import { InputControl } from './InputControl'

const Caption = ({ caption }: { caption: string }) => {
  return (
    <ControlRowContainer>
      <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
        {caption}
      </CapitalizeFirstLetter>
    </ControlRowContainer>
  )
}

export const HeightControl = ({
  selectedLayoutId,
  setInitialLayout,
  heightValue,
  setHeightValue,
}: {
  selectedLayoutId: Layout
  setInitialLayout: (layoutId: Layout) => void
  heightValue: number | undefined
  setHeightValue: (height: number | undefined) => void
}) => {
  const { setHeader, setContainer, getCurrentConfigTheme } = useConfigActions()

  const handleHeightChange = useCallback(
    (key: 'height' | 'maxHeight') =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number.parseInt(e.target.value, 10)
        const parsed = Number.isFinite(val) ? val : undefined

        setHeightValue(parsed)

        if (getCurrentConfigTheme()?.header) {
          setHeader()
        }

        if (parsed && parsed >= defaultMaxHeight) {
          setContainer({
            ...(getCurrentConfigTheme()?.container ?? {}),
            [key]: parsed,
          })
        }
      },
    [setHeightValue, getCurrentConfigTheme, setContainer, setHeader]
  )

  const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const val = Number.parseInt(e.target.value, 10)
      if (!Number.isFinite(val) || val < defaultMaxHeight) {
        setHeightValue(undefined)
        setInitialLayout(selectedLayoutId)
      }
    },
    [selectedLayoutId, setHeightValue, setInitialLayout]
  )

  if (selectedLayoutId === 'restricted-height') {
    return (
      <InputControl
        label="Set height"
        value={heightValue}
        onChange={handleHeightChange('height')}
        onBlur={handleBlur}
      />
    )
  }

  if (selectedLayoutId === 'restricted-max-height') {
    return (
      <InputControl
        label="Set max height"
        value={heightValue}
        onChange={handleHeightChange('maxHeight')}
        onBlur={handleBlur}
      />
    )
  }

  if (selectedLayoutId === 'fit-content') {
    return (
      <PlaygroundControlsContainer sx={{ gap: 0 }}>
        <InputControl
          label="Set max height"
          value={heightValue}
          onChange={handleHeightChange('maxHeight')}
          onBlur={handleBlur}
        />
        <Caption caption="max height is applied only to long pages" />
      </PlaygroundControlsContainer>
    )
  }

  if (selectedLayoutId === 'full-height') {
    return (
      <Caption caption="full height should be used with the compact variant" />
    )
  }

  return null
}
