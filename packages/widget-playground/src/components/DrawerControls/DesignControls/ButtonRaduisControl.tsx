import type { ChangeEventHandler } from 'react'
import { useState } from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions.js'
import { useConfigBorderRadiusSecondary } from '../../../store/widgetConfig/useConfigValues.js'
import { CardValue } from '../../Card/Card.style.js'
import { ExpandableCard } from '../../Card/ExpandableCard.js'
import {
  TabButton,
  TabButtonsContainer,
  TabCustomInput,
} from './DesignControls.style.js'

const clickableValues = [8, 12, 16]

export const ButtonRadiusControl = () => {
  const { borderRadiusSecondary } = useConfigBorderRadiusSecondary()
  const { setBorderRadiusSecondary, resetBorderRadiusSecondary } =
    useConfigActions()
  const [focused, setFocused] = useState<'input' | 'button'>()

  const initialCustomInputValue =
    Number.isFinite(borderRadiusSecondary) &&
    !clickableValues.includes(borderRadiusSecondary!)
      ? borderRadiusSecondary?.toString()
      : ''
  const [customValue, setCustomValue] = useState(initialCustomInputValue)

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target
    const cleanedValue = value.replace(/[.,\s]/g, '')
    const radius = Number(cleanedValue)

    if (cleanedValue === '') {
      setCustomValue(cleanedValue)
      resetBorderRadiusSecondary()
    } else if (Number.isFinite(radius)) {
      setCustomValue(cleanedValue)
      setBorderRadiusSecondary(radius)
    }
  }

  const handleBlurInput = () => {
    setFocused(undefined)

    if (customValue && clickableValues.includes(Number(customValue))) {
      setCustomValue('')
    }
  }

  const handleButtonClick = (radius: number) => {
    setCustomValue('')
    setBorderRadiusSecondary(radius)
  }

  const handleFocusInput = () => {
    setFocused('input')
  }

  const handleFocusButton = () => {
    setFocused('button')
  }

  return (
    <ExpandableCard
      title={'Button Radius'}
      value={
        <CardValue
          sx={{ textTransform: 'capitalize' }}
          data-testid="button-radius-value"
        >
          {borderRadiusSecondary}
        </CardValue>
      }
      dataTestId="button-radius-section"
    >
      <TabButtonsContainer sx={{ mt: 0.5 }}>
        {clickableValues.map((value) => {
          return (
            <TabButton
              key={value.toString()}
              selected={borderRadiusSecondary === value && focused !== 'input'}
              onClick={() => handleButtonClick(value)}
              data-testid="button-radius-value"
              onFocus={handleFocusButton}
              disableRipple
            >
              {value}
            </TabButton>
          )
        })}

        <TabCustomInput
          selected={
            borderRadiusSecondary !== undefined &&
            !clickableValues.includes(borderRadiusSecondary)
          }
          onChange={handleChangeInput}
          onBlur={handleBlurInput}
          inputProps={{ pattern: '[0-9]' }}
          onFocus={handleFocusInput}
          data-testid="button-radius-custom-input"
          placeholder={focused === 'input' ? '' : 'Custom'}
          value={customValue}
        />
      </TabButtonsContainer>
    </ExpandableCard>
  )
}
