import { useQuery } from '@tanstack/react-query'
import type { Chain } from 'viem'
import { mainnet } from 'viem/chains'

const LIFI_API_URL = 'https://li.quest/v1'

interface LiFiChain {
  id: number
  chainType: string
  metamask: {
    chainId: string
    chainName: string
    rpcUrls: string[]
    blockExplorerUrls: string[]
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
  }
  multicallAddress?: string
}

interface LiFiChainsResponse {
  chains: LiFiChain[]
}

function toViemChain(chain: LiFiChain): Chain {
  const viemChain: Chain = {
    id: chain.id,
    name: chain.metamask.chainName,
    nativeCurrency: chain.metamask.nativeCurrency,
    rpcUrls: {
      default: { http: chain.metamask.rpcUrls },
    },
    blockExplorers: chain.metamask.blockExplorerUrls.length
      ? {
          default: {
            name: chain.metamask.blockExplorerUrls[0],
            url: chain.metamask.blockExplorerUrls[0],
          },
        }
      : undefined,
    contracts: chain.multicallAddress
      ? { multicall3: { address: chain.multicallAddress as `0x${string}` } }
      : undefined,
  }

  // Preserve mainnet ENS contracts
  if (chain.id === mainnet.id) {
    viemChain.contracts = { ...mainnet.contracts, ...viemChain.contracts }
  }

  return viemChain
}

/**
 * Fetches EVM chains from the LI.FI API and converts them to viem `Chain`
 * objects. No dependency on `@lifi/sdk` or `@lifi/widget`.
 */
export function useChains(): {
  chains: Chain[] | undefined
  isLoading: boolean
} {
  const { data, isLoading } = useQuery({
    queryKey: ['lifi-chains'],
    queryFn: async (): Promise<Chain[]> => {
      const res = await fetch(`${LIFI_API_URL}/chains?chainTypes=EVM`)
      if (!res.ok) {
        throw new Error(`Failed to fetch chains: ${res.status}`)
      }
      const json: LiFiChainsResponse = await res.json()
      return json.chains.map(toViemChain)
    },
    refetchInterval: 300_000,
    staleTime: 300_000,
  })

  return { chains: data, isLoading }
}
