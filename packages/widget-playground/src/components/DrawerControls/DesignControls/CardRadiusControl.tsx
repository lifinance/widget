import type { ChangeEventHandler } from 'react'
import { useState } from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useConfigBorderRadius } from '../../../store/widgetConfig/useConfigValues'
import { CardValue } from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import {
  TabButton,
  TabButtonsContainer,
  TabCustomInput,
} from './DesignControls.style'

const clickableValues = [8, 12, 16]

export const CardRadiusControl = () => {
  const { borderRadius } = useConfigBorderRadius()
  const { setBorderRadius, resetBorderRadius } = useConfigActions()
  const [focused, setFocused] = useState<'input' | 'button'>()

  const initialCustomInputValue =
    Number.isFinite(borderRadius) && !clickableValues.includes(borderRadius!)
      ? borderRadius?.toString()
      : ''
  const [customValue, setCustomValue] = useState(initialCustomInputValue)

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target
    const cleanedValue = value.replace(/[.,\s]/g, '')
    const radius = Number(cleanedValue)

    if (cleanedValue === '') {
      setCustomValue(cleanedValue)
      resetBorderRadius()
    } else if (Number.isFinite(radius)) {
      setCustomValue(cleanedValue)
      setBorderRadius(radius)
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
    setBorderRadius(radius)
  }

  const handleFocusInput = () => {
    setFocused('input')
  }

  const handleFocusButton = () => {
    setFocused('button')
  }

  return (
    <ExpandableCard
      title={'Card Radius'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>
          {borderRadius}
        </CardValue>
      }
    >
      <TabButtonsContainer sx={{ mt: 0.5 }}>
        {clickableValues.map((value) => {
          return (
            <TabButton
              key={value.toString()}
              selected={borderRadius === value && focused !== 'input'}
              onClick={() => handleButtonClick(value)}
              onFocus={handleFocusButton}
              disableRipple
            >
              {value}
            </TabButton>
          )
        })}

        <TabCustomInput
          selected={
            borderRadius !== undefined &&
            !clickableValues.includes(borderRadius)
          }
          onChange={handleChangeInput}
          onBlur={handleBlurInput}
          inputProps={{ pattern: '[0-9]' }}
          onFocus={handleFocusInput}
          placeholder={focused === 'input' ? '' : 'Custom'}
          value={customValue}
        />
      </TabButtonsContainer>
    </ExpandableCard>
  )
}
