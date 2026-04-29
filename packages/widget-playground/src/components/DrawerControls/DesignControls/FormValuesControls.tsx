import { ChainType } from '@lifi/widget'
import { Box } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useState } from 'react'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions.js'
import type { FormValues } from '../../../store/types.js'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions.js'
import {
  FormBlock,
  MethodHint,
  MethodTab,
  MethodTabs,
  OptionButton,
  PresetStack,
  SectionLabel,
} from './FormValuesControls.style.js'

interface FormValuesLookUp {
  [key: string]: FormValues
}

const ChainsAndTokensLookUp: FormValuesLookUp = {
  'ETH-ETH | ARB-USDC': {
    fromChain: 1,
    fromToken: '0x0000000000000000000000000000000000000000',
    toChain: 42161,
    toToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  'ARB-USDC | OPT-USDT': {
    fromChain: 42161,
    fromToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    toChain: 10,
    toToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },
  'From: OPT-USDT': {
    fromChain: 10,
    fromToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },
  'From: ARB-DAI': {
    fromChain: 42161,
    fromToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
  'To: POL-WMATIC': {
    toChain: 137,
    toToken: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  'To: AVA-AVAX': {
    toChain: 43114,
    toToken: '0x0000000000000000000000000000000000000000',
  },
  RESET: {
    fromChain: undefined,
    fromToken: undefined,
    toChain: undefined,
    toToken: undefined,
  },
  'RESET From': {
    fromChain: undefined,
    fromToken: undefined,
  },
  'RESET To': {
    toChain: undefined,
    toToken: undefined,
  },
}

const AddressLookUp: FormValuesLookUp = {
  '0x29D...94eD7': {
    toAddress: {
      address: '0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494eD7',
      chainType: ChainType.EVM,
    },
  },
  '0x457...22CE0': {
    toAddress: {
      address: '0x4577a46A3eCf44E0ed44410B7793977ffbe22CE0',
      chainType: ChainType.EVM,
    },
  },
  Lenny: {
    toAddress: {
      name: 'Lenny',
      address: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea9',
      chainType: ChainType.EVM,
    },
  },
  RESET: {
    toAddress: undefined,
  },
}

const fromAmountLookUp: FormValuesLookUp = {
  '1': {
    fromAmount: '1',
  },
  '0.5': {
    fromAmount: 0.5,
  },
  RESET: {
    fromAmount: undefined,
  },
}

const toAmountLookUp: FormValuesLookUp = {
  '1': {
    toAmount: '1',
  },
  '0.5': {
    toAmount: 0.5,
  },
  RESET: {
    toAmount: undefined,
  },
}

const forceConfigUpdate = (nextValue: FormValues): FormValues => ({
  ...nextValue,
  formUpdateKey: Date.now().toString(),
})

const chainTokenPresetRows: { id: string; label: string }[] = [
  { id: 'ETH-ETH | ARB-USDC', label: 'ETH-ETH → ARB-USDC' },
  { id: 'ARB-USDC | OPT-USDT', label: 'ARB-USDC → OPT-USDT' },
  { id: 'RESET', label: 'RESET' },
]

const amountPresetKeys = ['1', '0.5', 'RESET'] as const

const addressPresetRows: { id: string; label: string }[] = [
  { id: '0x29D...94eD7', label: '0x29D…94eD7' },
  { id: '0x457...22CE0', label: '0x457…22CE0' },
  { id: 'RESET', label: 'RESET' },
]

export const FormValuesDevPanel = (): JSX.Element => {
  const { setFormValues: setFormValuesViaConfig } = useConfigActions()
  const { setFormValues: setFormValuesViaFormApiRef } = useEditToolsActions()
  const [formUpdateMethod, setFormUpdateMethod] = useState<
    'formApi' | 'config'
  >('config')

  const [chainKey, setChainKey] = useState<string>('ETH-ETH | ARB-USDC')
  const [fromAmountKey, setFromAmountKey] = useState<string>('1')
  const [toAmountKey, setToAmountKey] = useState<string>('1')
  const [addressKey, setAddressKey] = useState<string>('0x29D...94eD7')

  const applyFormValues = useCallback(
    (next: FormValues): void => {
      const apply =
        formUpdateMethod === 'formApi'
          ? setFormValuesViaFormApiRef
          : setFormValuesViaConfig
      apply(forceConfigUpdate(next))
    },
    [formUpdateMethod, setFormValuesViaConfig, setFormValuesViaFormApiRef]
  )

  const handleChainAndTokenChange = useCallback(
    (value: string) => {
      const chainsAndTokens = ChainsAndTokensLookUp[value]
      if (chainsAndTokens) {
        setChainKey(value)
        applyFormValues(chainsAndTokens)
      }
    },
    [applyFormValues]
  )

  const handleToAddressChange = useCallback(
    (value: string) => {
      const addressValue = AddressLookUp[value]
      if (addressValue) {
        setAddressKey(value)
        applyFormValues(addressValue)
      }
    },
    [applyFormValues]
  )

  const handleFromAmountChange = useCallback(
    (value: string) => {
      const amountValue = fromAmountLookUp[value]
      if (amountValue) {
        setFromAmountKey(value)
        applyFormValues(amountValue)
      }
    },
    [applyFormValues]
  )

  const handleToAmountChange = useCallback(
    (value: string) => {
      const amountValue = toAmountLookUp[value]
      if (amountValue) {
        setToAmountKey(value)
        applyFormValues(amountValue)
      }
    },
    [applyFormValues]
  )

  const handleMethodChange = useCallback(
    (_: React.SyntheticEvent, value: 'formApi' | 'config'): void => {
      setFormUpdateMethod(value)
    },
    []
  )

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}
    >
      <FormBlock>
        <MethodTabs
          value={formUpdateMethod}
          onChange={handleMethodChange}
          aria-label="Form values update method"
        >
          <MethodTab label="config" value="config" disableRipple />
          <MethodTab label="formRef" value="formApi" disableRipple />
        </MethodTabs>
        <MethodHint>
          Use config if you need static values, or use formRef if you want to
          update values from your app.
        </MethodHint>
      </FormBlock>

      <FormBlock>
        <SectionLabel>Chains and tokens</SectionLabel>
        <PresetStack>
          {chainTokenPresetRows.map(({ id, label }) => (
            <OptionButton
              key={id}
              type="button"
              selected={chainKey === id}
              onClick={() => handleChainAndTokenChange(id)}
            >
              {label}
            </OptionButton>
          ))}
        </PresetStack>
      </FormBlock>

      <FormBlock>
        <SectionLabel>From amount</SectionLabel>
        <PresetStack>
          {amountPresetKeys.map((key) => (
            <OptionButton
              key={key}
              type="button"
              selected={fromAmountKey === key}
              onClick={() => handleFromAmountChange(key)}
            >
              {key}
            </OptionButton>
          ))}
        </PresetStack>
      </FormBlock>

      <FormBlock>
        <SectionLabel>To amount</SectionLabel>
        <PresetStack>
          {amountPresetKeys.map((key) => (
            <OptionButton
              key={key}
              type="button"
              selected={toAmountKey === key}
              onClick={() => handleToAmountChange(key)}
            >
              {key}
            </OptionButton>
          ))}
        </PresetStack>
      </FormBlock>

      <FormBlock>
        <SectionLabel>To address</SectionLabel>
        <PresetStack>
          {addressPresetRows.map(({ id, label }) => (
            <OptionButton
              key={id}
              type="button"
              selected={addressKey === id}
              onClick={() => handleToAddressChange(id)}
            >
              {label}
            </OptionButton>
          ))}
        </PresetStack>
      </FormBlock>
    </Box>
  )
}
