import type { ExtendedChain, Route } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useMemo } from 'react'
import { useChain } from './useChain.js'

export const useRouteRequiredAccountConnection = (
  route?: Route,
  chain?: ExtendedChain
) => {
  const { account, accounts } = useAccount({ chainType: chain?.chainType })
  const { getChainById } = useChain()

  return useMemo(() => {
    if (!route?.steps.length) {
      return {
        connected: account.isConnected,
      }
    }

    const connectedChainTypes = new Set(
      accounts
        .filter((acc) => acc.isConnected && acc.address)
        .map((acc) => acc.chainType)
    )

    for (const step of route.steps) {
      const chain = getChainById(step.action.fromChainId)
      if (chain && !connectedChainTypes.has(chain.chainType)) {
        return {
          connected: false,
          missingChain: {
            name: chain.name,
            chainType: chain.chainType,
          },
        }
      }
    }

    return { connected: true }
  }, [account.isConnected, route?.steps, accounts, getChainById])
}
