import { ChainType } from '@lifi/sdk'
import { useEVMContext } from '@lifi/wallet-provider'
import { useQuery } from '@tanstack/react-query'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { getQueryKey } from '../utils/queries.js'
import { useAvailableChains } from './useAvailableChains.js'

interface AddressActivity {
  hasActivity: boolean
  isLoading: boolean
  isFetched: boolean
  toAddress: string | undefined
}
export const useAddressActivity = (chainId?: number): AddressActivity => {
  const { keyPrefix } = useWidgetConfig()
  const { getChainById } = useAvailableChains()
  const [toAddress, toChainId] = useFieldValues('toAddress', 'toChain')
  const { getTransactionCount } = useEVMContext()

  const destinationChainId = chainId ?? toChainId
  const toChain = getChainById(destinationChainId)

  const {
    data: transactionCount,
    isLoading,
    isFetched,
    error,
  } = useQuery({
    queryKey: [
      getQueryKey('getTransactionCount', keyPrefix),
      toAddress,
      destinationChainId,
    ],
    queryFn: async () => {
      const count = await getTransactionCount?.(destinationChainId!, toAddress!)
      return count ?? null
    },
    refetchInterval: 300_000,
    staleTime: 300_000,
    enabled:
      toChain?.chainType === ChainType.EVM &&
      !!destinationChainId &&
      !!toAddress &&
      !!getTransactionCount,
  })

  return {
    toAddress,
    hasActivity: Boolean(transactionCount && transactionCount > 0),
    isLoading,
    isFetched: isFetched && !error,
  }
}
