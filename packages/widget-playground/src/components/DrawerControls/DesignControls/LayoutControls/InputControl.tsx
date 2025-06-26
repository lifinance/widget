import { defaultMaxHeight } from '@lifi/widget'
import {
  type ChangeEventHandler,
  type FocusEventHandler,
  type HTMLAttributes,
  useId,
} from 'react'
import { CardRowColumn, CardRowContainer } from '../../../Card/Card.style'
import { CapitalizeFirstLetter, Input } from '../DesignControls.style'

interface InputControlProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: number | undefined
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
  return (
    <CardRowContainer sx={{ padding: 1 }}>
      <CardRowColumn>
        <label htmlFor={inputId}>{label}</label>
        {(value && value < defaultMaxHeight) || !value ? (
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
