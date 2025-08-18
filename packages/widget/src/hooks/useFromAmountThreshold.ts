import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { FormKeyHelper } from '../stores/form/types.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'
import { formatTokenPrice } from '../utils/format.js'
import { useToken } from './useToken.js'

export const useFromAmountThreshold = () => {
  const { minFromAmountUSD } = useWidgetConfig()

  const [chainId, tokenAddress, fromAmount] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from'),
    FormKeyHelper.getAmountKey('from')
  )
  const { token } = useToken(chainId, tokenAddress)

  const belowMinFromAmountUSD = useMemo(() => {
    const fromAmountUSD = formatTokenPrice(
      fromAmount,
      token?.priceUSD,
      token?.decimals
    )

    if (!minFromAmountUSD || !fromAmountUSD) {
      return false
    }
    return fromAmountUSD < minFromAmountUSD
  }, [minFromAmountUSD, fromAmount, token?.priceUSD, token?.decimals])

  return {
    belowMinFromAmountUSD,
    minFromAmountUSD,
  }
}
