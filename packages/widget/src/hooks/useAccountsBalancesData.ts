import type { ChainType, TokenExtended } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import { useMemo } from 'react'
import type { FormType } from '../stores/form/types.js'
import { useChains } from './useChains.js'
import { useFilteredTokensByBalance } from './useFilteredByTokenBalances.js'

export const useAccountsBalancesData = (
  selectedChainId?: number,
  formType?: FormType,
  isAllNetworks?: boolean,
  allTokens?: Record<number, TokenExtended[]>
) => {
  const { data: accountsWithTokens, isLoading: isAccountsLoading } =
    useAccountsData(selectedChainId, formType, isAllNetworks, allTokens)

  // Filter out EVM tokens that do not have balances
  const { data: filteredTokens, isLoading: isCachedBalancesLoading } =
    useFilteredTokensByBalance(accountsWithTokens)

  return {
    data: filteredTokens,
    isLoading: isAccountsLoading || isCachedBalancesLoading,
  }
}

const useAccountsData = (
  selectedChainId?: number,
  formType?: FormType,
  isAllNetworks?: boolean,
  allTokens?: Record<number, TokenExtended[]>
) => {
  const {
    chains: allChains,
    isLoading: isChainsLoading,
    getChainById,
  } = useChains(formType)
  const currentChain = useMemo(() => {
    return selectedChainId
      ? getChainById(selectedChainId, allChains)
      : undefined
  }, [selectedChainId, allChains, getChainById])
  const chains = useMemo(() => {
    return isAllNetworks ? allChains : currentChain ? [currentChain] : undefined
  }, [allChains, isAllNetworks, currentChain])

  const { accounts: allAccounts, account: currentAccount } = useAccount(
    isAllNetworks ? undefined : { chainType: currentChain?.chainType }
  )
  const accounts = useMemo(() => {
    return isAllNetworks
      ? allAccounts
      : currentAccount
        ? [currentAccount]
        : undefined
  }, [allAccounts, currentAccount, isAllNetworks])

  const accountsWithTokens = useMemo(() => {
    if (!chains || !allTokens || !accounts?.length) {
      return undefined
    }
    return accounts
      ?.filter((account) => account.address)
      .reduce(
        (acc, account) => {
          if (account.address) {
            const accountChains = chains?.filter(
              (chain) => account.chainType === chain?.chainType
            )
            if (accountChains) {
              const chainIdSet = new Set(accountChains.map((chain) => chain.id))
              const filteredTokens = Object.entries(allTokens).reduce(
                (tokenAcc, [chainIdStr, tokens]) => {
                  const chainId = Number(chainIdStr)
                  if (chainIdSet.has(chainId)) {
                    tokenAcc[chainId] = tokens
                  }
                  return tokenAcc
                },
                {} as { [chainId: number]: TokenExtended[] }
              )
              acc[account.address] = {
                chainType: account.chainType,
                tokens: filteredTokens,
              }
            }
          }
          return acc
        },
        {} as Record<
          string,
          { chainType: ChainType; tokens: Record<number, TokenExtended[]> }
        >
      )
  }, [accounts, chains, allTokens])

  return {
    data: accountsWithTokens,
    isLoading: isChainsLoading,
  }
}
