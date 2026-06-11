import { ChainType } from '@lifi/widget'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { DetailViewLayout } from '../DetailView/DetailViewLayout.js'
import { Field, FieldInput, FieldLabel } from './CheckoutControls.style.js'

interface CheckoutControlsProps {
  onBack: () => void
}

export const CheckoutControls = ({
  onBack,
}: CheckoutControlsProps): JSX.Element => {
  const { config } = useConfig()
  const { setConfig } = useConfigActions()

  const toChainValue = config?.toChain != null ? String(config.toChain) : ''
  const toTokenValue = config?.toToken ?? ''
  const toAddressValue =
    typeof config?.toAddress === 'string'
      ? config.toAddress
      : (config?.toAddress?.address ?? '')

  const handleChainChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const raw = event.target.value.trim()
      const parsed = Number.parseInt(raw, 10)
      setConfig({ toChain: Number.isNaN(parsed) ? undefined : parsed })
    },
    [setConfig]
  )

  const handleTokenChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = event.target.value.trim()
      setConfig({ toToken: value || undefined })
    },
    [setConfig]
  )

  const handleAddressChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = event.target.value.trim()
      setConfig({
        toAddress: value
          ? { address: value, chainType: ChainType.EVM }
          : undefined,
      })
    },
    [setConfig]
  )

  const handleReset = useCallback((): void => {
    setConfig({ toChain: undefined, toToken: undefined, toAddress: undefined })
  }, [setConfig])

  return (
    <DetailViewLayout
      onBack={onBack}
      onReset={handleReset}
      resetLabel="Reset destination"
      title="Checkout"
      description="Set the destination chain, token, and recipient the checkout funds. Leave the recipient empty to let the user set it."
      variant="sections"
      contentSx={{ gap: 2 }}
    >
      <Field>
        <FieldLabel>Destination chain ID</FieldLabel>
        <FieldInput
          value={toChainValue}
          onChange={handleChainChange}
          placeholder="1"
          inputProps={{
            inputMode: 'numeric',
            'aria-label': 'Destination chain ID',
          }}
        />
      </Field>
      <Field>
        <FieldLabel>Destination token address</FieldLabel>
        <FieldInput
          value={toTokenValue}
          onChange={handleTokenChange}
          placeholder="0x…"
          inputProps={{ 'aria-label': 'Destination token address' }}
        />
      </Field>
      <Field>
        <FieldLabel>Recipient address (optional)</FieldLabel>
        <FieldInput
          value={toAddressValue}
          onChange={handleAddressChange}
          placeholder="0x… — leave empty for user-set"
          inputProps={{ 'aria-label': 'Recipient address' }}
        />
      </Field>
    </DetailViewLayout>
  )
}
