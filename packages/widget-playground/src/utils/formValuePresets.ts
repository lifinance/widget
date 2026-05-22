import { ChainType } from '@lifi/widget'
import type { FormValues } from '../store/types.js'

type FormValuesPresetLookup = Record<string, FormValues>

export const chainsAndTokensPresets: FormValuesPresetLookup = {
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
  RESET: {
    fromChain: undefined,
    fromToken: undefined,
    toChain: undefined,
    toToken: undefined,
  },
}

export const addressPresets: FormValuesPresetLookup = {
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
  RESET: {
    toAddress: undefined,
  },
}

export const amountPresets: FormValuesPresetLookup = {
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

export const chainTokenPresetRows = [
  { id: 'ETH-ETH | ARB-USDC', label: 'ETH-ETH → ARB-USDC' },
  { id: 'ARB-USDC | OPT-USDT', label: 'ARB-USDC → OPT-USDT' },
  { id: 'RESET', label: 'RESET' },
] as const

export const amountPresetRows = [
  { id: '1', label: '1' },
  { id: '0.5', label: '0.5' },
  { id: 'RESET', label: 'RESET' },
] as const

export const addressPresetRows = [
  { id: '0x29D...94eD7', label: '0x29D…94eD7' },
  { id: '0x457...22CE0', label: '0x457…22CE0' },
  { id: 'RESET', label: 'RESET' },
] as const

export const defaultFormValueKeys = {
  chain: 'ETH-ETH | ARB-USDC',
  amount: '1',
  address: '0x29D...94eD7',
} as const

export const getDefaultFormValues = (): FormValues => ({
  ...chainsAndTokensPresets[defaultFormValueKeys.chain],
  ...amountPresets[defaultFormValueKeys.amount],
  ...addressPresets[defaultFormValueKeys.address],
})

export const getResetFormValues = (): FormValues => ({
  ...chainsAndTokensPresets.RESET,
  ...amountPresets.RESET,
  ...addressPresets.RESET,
})

export const withFormUpdateKey = (values: FormValues): FormValues => ({
  ...values,
  formUpdateKey: Date.now().toString(),
})
