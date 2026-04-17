import {
  ChainType,
  createClient,
  type ExtendedChain,
  getChains,
} from '@lifi/sdk'
import { convertExtendedChain } from '@lifi/widget-provider-ethereum'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const client = createClient({ integrator: 'vite-iframe-example' })

const chainTypes = [ChainType.EVM, ChainType.SVM, ChainType.UTXO, ChainType.MVM]

/**
 * Fetches all chains from the LI.FI API via the SDK.
 *
 * Returns both the raw `ExtendedChain[]` (for ecosystem providers) and
 * viem `Chain[]` derived from the EVM subset (for wagmi).
 */
export function useChains() {
  const { data, isLoading } = useQuery({
    queryKey: ['lifi-chains'],
    queryFn: async () => {
      const chains = await getChains(client, { chainTypes })
      client.setChains(chains)
      return chains
    },
    refetchInterval: 300_000,
    staleTime: 300_000,
  })

  const evmChains = useMemo(
    () =>
      data
        ?.filter((c: ExtendedChain) => c.chainType === 'EVM')
        .map(convertExtendedChain),
    [data]
  )

  return {
    chains: data,
    evmChains,
    isLoading,
  }
}
