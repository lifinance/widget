import type { ExtendedChain, Route } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useMemo } from 'react'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { useChain } from './useChain.js'

export const useRouteRequiredAccountConnection = (
  route?: Route,
  chain?: ExtendedChain
) => {
  const { account, accounts } = useAccount({ chainType: chain?.chainType })
  const [toAddress] = useFieldValues('toAddress')
  const { getChainById } = useChain()

  return useMemo(() => {
    if (!route?.steps.length) {
      return {
        connected: account.isConnected,
      }
    }

    const connectedChainTypes = new Map(
      accounts
        .filter((account) => account.isConnected && account.address)
        .map((account) => [account.chainType, account])
    )

    if (!connectedChainTypes.size) {
      return {
        connected: false,
      }
    }

    for (const step of route.steps) {
      const chain = getChainById(step.action.fromChainId)
      if (!chain) {
        continue
      }

      const connectedAccount = connectedChainTypes.get(chain.chainType)
      const isToAddressSatisfied = toAddress
        ? connectedAccount?.address === step.action.fromAddress
        : true

      if (!connectedAccount || !isToAddressSatisfied) {
        return {
          connected: false,
          missingChain: chain,
          missingAccountAddress: !isToAddressSatisfied
            ? step.action.fromAddress
            : undefined,
        }
      }
    }

    return { connected: true }
  }, [account.isConnected, route, accounts, getChainById, toAddress])
}
