import type { RouteExtended, Token } from '@lifi/sdk'
import type { RefObject } from 'react'
import { useMemo, useRef } from 'react'
import type { BottomSheetBase } from '../components/BottomSheet/types.js'
import { getNativeTokenAddresses } from '../utils/token.js'
import { useAvailableChains } from './useAvailableChains.js'

/**
 * Route tokens the screening provider flagged, and the sheet that warns about
 * them before the transaction starts. A native token is exempt: the provider
 * screens the native-address convention and calls it a scam on some chains.
 */
export const useFlaggedTokenGuard = (
  route: RouteExtended
): {
  flaggedTokens: Token[]
  flaggedTokenSheetRef: RefObject<BottomSheetBase | null>
} => {
  const { chains } = useAvailableChains()
  const flaggedTokenSheetRef = useRef<BottomSheetBase>(null)

  const flaggedTokens = useMemo(() => {
    const nativeTokenAddresses = getNativeTokenAddresses(chains)
    return [route.fromToken, route.toToken].filter(
      (token) =>
        token.verificationStatus === 'flagged' &&
        nativeTokenAddresses.get(token.chainId)?.toLowerCase() !==
          token.address.toLowerCase()
    )
  }, [chains, route.fromToken, route.toToken])

  return { flaggedTokens, flaggedTokenSheetRef }
}
