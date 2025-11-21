import {
  type BaseToken,
  ChainType,
  getWalletBalances,
  type TokenExtended,
  type WalletTokenExtended,
} from '@lifi/sdk'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSDKClient } from '../providers/SDKClientProvider.js'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import { getConfigItemSets, isFormItemAllowed } from '../utils/item.js'
import { isSupportedToken } from '../utils/tokenList.js'

export const useFilteredTokensByBalance = (
  accountsWithTokens?: Record<
    string,
    { chainType: ChainType; tokens: Record<number, TokenExtended[]> }
  >,
  formType?: FormType
) => {
  const { tokens: configTokens } = useWidgetConfig()
  const sdkClient = useSDKClient()

  const evmAddress = useMemo(() => {
    const evmAccount = Object.entries(accountsWithTokens ?? {}).find(
      ([_, { chainType }]) => chainType === ChainType.EVM
    )
    return evmAccount?.[0]
  }, [accountsWithTokens])

  const { data: existingBalances, isLoading } = useQuery({
    queryKey: ['existing-evm-balances', evmAddress],
    queryFn: () => getWalletBalances(sdkClient, evmAddress ?? ''),
    enabled: !!evmAddress,
    refetchInterval: 30_000, // 30 seconds
    staleTime: 30_000, // 30 seconds
    retry: false,
  })

  const accountsWithFilteredTokens = useMemo(() => {
    if (!accountsWithTokens) {
      return undefined
    }

    // Early return if no existing balances - return all tokens
    const result: Record<string, Record<number, TokenExtended[]>> = {}
    if (!existingBalances) {
      for (const [address, { tokens }] of Object.entries(accountsWithTokens)) {
        result[address] = tokens
      }
      return result
    }

    for (const [address, { tokens }] of Object.entries(accountsWithTokens)) {
      result[address] = {}

      for (const [chainIdStr, chainTokens] of Object.entries(tokens)) {
        const chainId = Number(chainIdStr)
        // Get balances for this specific chain
        const balances = existingBalances?.[chainId]
        // If no balances, RPC all tokens of the chain
        if (!balances?.length) {
          if (chainTokens.length) {
            result[address][chainId] = chainTokens
          }
          continue
        }

        // Optimize token matching with Set for O(1) lookup
        const balanceSet = new Set(
          balances.map((balance: WalletTokenExtended) =>
            balance.address.toLowerCase()
          )
        )

        // Get tokens that are in chainTokens and have balances
        const filteredTokens = chainTokens.filter((token) => {
          const tokenKey = token.address.toLowerCase()
          return balanceSet.has(tokenKey)
        })

        // Get tokens that are in balances but not in chainTokens
        const chainTokenSet = new Set(
          chainTokens.map((token) => token.address.toLowerCase())
        )

        // Get allowed addresses from config tokens
        const allowedAddressesConfig = getConfigItemSets(
          configTokens,
          (tokens: BaseToken[]) =>
            new Set(
              tokens
                .filter((t) => Number(t.chainId) === chainId)
                .map((t) => t.address.toLowerCase())
            ),
          formType
        )

        const additionalTokens = balances.filter(
          (balance: WalletTokenExtended) => {
            const balanceKey = balance.address.toLowerCase()
            return (
              !chainTokenSet.has(balanceKey) &&
              isSupportedToken(balance) &&
              isFormItemAllowed(
                balance,
                allowedAddressesConfig,
                formType,
                (t) => t.address.toLowerCase()
              )
            )
          }
        ) as TokenExtended[]

        // Combine both sets of tokens - convert WalletTokenExtended to TokenAmount
        const allTokens = [
          ...filteredTokens,
          ...additionalTokens,
        ] as TokenExtended[]

        if (allTokens.length) {
          result[address][chainId] = allTokens
        }
      }
    }

    return result
  }, [accountsWithTokens, existingBalances, configTokens, formType])

  return { data: accountsWithFilteredTokens, isLoading }
}
