import { defaultMaxHeight } from '@lifi/widget'
import {
  type ChangeEventHandler,
  type FocusEventHandler,
  type HTMLAttributes,
  useId,
} from 'react'
import { CardRowColumn, CardRowContainer } from '../../../Card/Card.style.js'
import { CapitalizeFirstLetter, Input } from '../DesignControls.style.js'

interface InputControlProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: number | 'fit-content' | undefined
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur: FocusEventHandler<HTMLInputElement>
}

export const InputControl = ({
  label,
  value,
  onChange,
  onBlur,
}: InputControlProps) => {
  const inputId = useId()
  const showCaption =
    !value || value === 'fit-content' || (value && value < defaultMaxHeight)
  return (
    <CardRowContainer sx={{ padding: 1 }}>
      <CardRowColumn>
        <label htmlFor={inputId}>{label}</label>
        {showCaption ? (
          <CapitalizeFirstLetter variant="caption">
            {`${defaultMaxHeight}px minimum`}
          </CapitalizeFirstLetter>
        ) : null}
      </CardRowColumn>
      <Input
        id={inputId}
        type="number"
        value={value ?? ''}
        placeholder={`${defaultMaxHeight}`}
        onChange={onChange}
        onBlur={onBlur}
      />
    </CardRowContainer>
  )
}
