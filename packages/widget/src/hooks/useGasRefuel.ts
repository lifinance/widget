import type { ExtendedChain } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useAddressForChain } from '@lifi/widget-provider'
import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useAvailableChains } from './useAvailableChains.js'
import { useGasRecommendation } from './useGasRecommendation.js'
import { useIsContractAddress } from './useIsContractAddress.js'
import { useTokenBalance } from './useTokenBalance.js'

export const useGasRefuel = (): {
  enabled: boolean
  availble: boolean | undefined
  isLoading: boolean
  chain: ExtendedChain | undefined
  fromAmount: string | undefined
} => {
  const { getChainById } = useAvailableChains()
  const { mode, hiddenUI } = useWidgetConfig()
  const [fromChainId, fromTokenAddress, toChainId, toAddress] = useFieldValues(
    'fromChain',
    'fromToken',
    'toChain',
    'toAddress'
  )

  const toChain = getChainById(toChainId)
  const fromChain = getChainById(fromChainId)

  const { account: toAccount } = useAccount({ chainType: toChain?.chainType })
  const { isAddressForChain } = useAddressForChain()

  // A shared chain type is not a shared format: a Bitcoin account cannot receive on ZEC.
  const toAccountAddress =
    toAccount?.address &&
    toChain &&
    isAddressForChain(toAccount.address, toChain)
      ? toAccount.address
      : undefined

  // Refuel mode already delivers native gas, so it never refuels. A refuel on
  // top would add more gas than the user asked for, behind a toggle that mode
  // does not need. Without inputs, the lookups below keep their queries off,
  // and `fromAmount` stays undefined, so the routes query key does not change.
  const isRefuelMode = mode === 'refuel'

  const effectiveToAddress = isRefuelMode
    ? undefined
    : toAddress || toAccountAddress

  const { isContractAddress: isToContractAddress } = useIsContractAddress(
    effectiveToAddress,
    toChainId,
    toChain?.chainType
  )

  const { token: destinationNativeToken } = useTokenBalance(
    effectiveToAddress,
    toChainId ? toChain?.nativeToken : undefined
  )

  const { data: gasRecommendation, isLoading } = useGasRecommendation(
    isRefuelMode ? undefined : toChainId,
    isRefuelMode ? undefined : fromChainId,
    isRefuelMode ? undefined : fromTokenAddress
  )

  // When we bridge between ecosystems we need to be sure toAddress is set
  const isChainTypeSatisfied =
    fromChain?.chainType !== toChain?.chainType ? Boolean(toAddress) : true

  // We should not refuel to the contract address
  const isToAddressSatisfied = effectiveToAddress && !isToContractAddress

  const enabled = useMemo(() => {
    if (
      isRefuelMode ||
      // Same chain refuel is not allowed since users need gas on source chain to initiate transaction
      // We allow refuel when bridging to native token since bridging routes may require gas for destination swaps
      fromChainId === toChainId ||
      !gasRecommendation?.available ||
      !gasRecommendation?.recommended ||
      !destinationNativeToken ||
      !isChainTypeSatisfied ||
      !isToAddressSatisfied ||
      hiddenUI?.gasRefuelMessage
    ) {
      return false
    }
    const tokenBalance = destinationNativeToken.amount ?? 0n

    // Check if the user balance < 50% of the recommended amount
    const recommendedAmount = BigInt(gasRecommendation.recommended.amount) / 2n

    const insufficientGas = tokenBalance < recommendedAmount
    return insufficientGas
  }, [
    isRefuelMode,
    fromChainId,
    gasRecommendation,
    isChainTypeSatisfied,
    isToAddressSatisfied,
    destinationNativeToken,
    toChainId,
    hiddenUI,
  ])

  return {
    enabled: enabled,
    availble: gasRecommendation?.available,
    isLoading: isLoading,
    chain: toChain,
    fromAmount: gasRecommendation?.available
      ? gasRecommendation.fromAmount
      : undefined,
  }
}
