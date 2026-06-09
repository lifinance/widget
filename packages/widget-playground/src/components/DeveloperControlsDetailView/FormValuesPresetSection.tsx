import type { JSX } from 'react'
import {
  FormBlock,
  OptionButton,
  PresetStack,
  SectionLabel,
} from './FormValuesPresetSection.style.js'

interface FormValuesPresetSectionProps {
  label: string
  options: readonly { id: string; label: string }[]
  selectedId: string
  onSelect: (id: string) => void
  resetTestId?: string
}

export const FormValuesPresetSection = ({
  label,
  options,
  selectedId,
  onSelect,
  resetTestId,
}: FormValuesPresetSectionProps): JSX.Element => {
  return (
    <FormBlock>
      <SectionLabel>{label}</SectionLabel>
      <PresetStack>
        {options.map(({ id, label: optionLabel }) => (
          <OptionButton
            key={id}
            type="button"
            selected={selectedId === id}
            onClick={() => onSelect(id)}
            {...(id === 'RESET' &&
              resetTestId && { 'data-testid': resetTestId })}
          >
            {optionLabel}
          </OptionButton>
        ))}
      </PresetStack>
    </FormBlock>
  )
}
