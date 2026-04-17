import { defaultMaxHeight } from '@lifi/widget'
import {
  type FocusEventHandler,
  type JSX,
  type SyntheticEvent,
  useCallback,
} from 'react'
import type { Layout } from '../../../../store/editTools/types.js'
import { useConfig } from '../../../../store/widgetConfig/useConfig.js'
import { useConfigActions } from '../../../../store/widgetConfig/useConfigActions.js'
import { CardRowContainer } from '../../../Card/Card.style.js'
import { Switch } from '../../../Switch.js'
import {
  CapitalizeFirstLetter,
  ControlRowContainer,
} from '../DesignControls.style.js'
import { InputControl } from './InputControl.js'

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
}): JSX.Element | null => {
  const { config } = useConfig()
  const { setHeader, setContainer, getCurrentConfigTheme } = useConfigActions()

  const applyOnlyToLongLists =
    config?.theme?.container?.height === 'fit-content'

  const handleApplyOnlyToLongListsChange = useCallback(
    (_: SyntheticEvent, value: boolean) => {
      setContainer({
        ...(getCurrentConfigTheme()?.container ?? {}),
        height: value ? 'fit-content' : undefined,
      })
    },
    [getCurrentConfigTheme, setContainer]
  )

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
      <>
        <InputControl
          label="Set max height"
          value={heightValue}
          onChange={handleHeightChange('maxHeight')}
          onBlur={handleBlur}
        />
        <CardRowContainer sx={{ padding: 1 }}>
          Apply only to pages with long lists
          <Switch
            checked={applyOnlyToLongLists}
            onChange={handleApplyOnlyToLongListsChange}
            aria-label="Apply only to pages with long lists"
          />
        </CardRowContainer>
      </>
    )
  }

  if (selectedLayoutId === 'full-height') {
    return (
      <Caption caption="full height should be used with the compact variant" />
    )
  }

  return null
}
