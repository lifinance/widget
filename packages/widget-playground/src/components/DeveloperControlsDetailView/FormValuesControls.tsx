import type { JSX } from 'react'
import { useCallback } from 'react'
import { useFormValuesDevPanel } from '../../hooks/useFormValuesDevPanel.js'
import {
  addressPresetRows,
  amountPresetRows,
  chainTokenPresetRows,
} from '../../utils/formValuePresets.js'
import { Tab, Tabs } from '../Tabs.style.js'
import {
  FormBlock,
  FormValuesContainer,
  MethodHint,
} from './FormValuesControls.style.js'
import { FormValuesPresetSection } from './FormValuesPresetSection.js'

export const FormValuesControls = (): JSX.Element => {
  const {
    formUpdateMethod,
    setFormUpdateMethod,
    chainKey,
    fromAmountKey,
    addressKey,
    selectChainPreset,
    selectAmountPreset,
    selectAddressPreset,
  } = useFormValuesDevPanel()

  const handleMethodChange = useCallback(
    (_: React.SyntheticEvent, value: 'formApi' | 'config'): void => {
      setFormUpdateMethod(value)
    },
    [setFormUpdateMethod]
  )

  return (
    <FormValuesContainer>
      <FormBlock>
        <Tabs
          value={formUpdateMethod}
          onChange={handleMethodChange}
          aria-label="Form values update method"
        >
          <Tab label="config" value="config" disableRipple />
          <Tab label="formRef" value="formApi" disableRipple />
        </Tabs>
        <MethodHint>
          Use config if you need static values, or use formRef if you want to
          update values from your app.
        </MethodHint>
      </FormBlock>

      <FormValuesPresetSection
        label="Chains and tokens"
        options={chainTokenPresetRows}
        selectedId={chainKey}
        onSelect={selectChainPreset}
        resetTestId="playground-chains-reset-button"
      />
      <FormValuesPresetSection
        label="Amount"
        options={amountPresetRows}
        selectedId={fromAmountKey}
        onSelect={selectAmountPreset}
        resetTestId="playground-amount-reset-button"
      />
      <FormValuesPresetSection
        label="To address"
        options={addressPresetRows}
        selectedId={addressKey}
        onSelect={selectAddressPreset}
        resetTestId="playground-address-reset-button"
      />
    </FormValuesContainer>
  )
}
