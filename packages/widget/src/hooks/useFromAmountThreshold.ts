import { useMemo } from 'react'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider'
import { FormKeyHelper } from '../stores/form/types'
import { useFieldValues } from '../stores/form/useFieldValues'
import { formatTokenPrice } from '../utils/format'
import { useToken } from './useToken'

export const useFromAmountThreshold = () => {
  const { minFromAmountUSD } = useWidgetConfig()

  const [chainId, tokenAddress, fromAmount] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from'),
    FormKeyHelper.getAmountKey('from')
  )
  const { token } = useToken(chainId, tokenAddress)

  const belowMinFromAmountUSD = useMemo(() => {
    const fromAmountUSD = formatTokenPrice(fromAmount, token?.priceUSD)

    if (!minFromAmountUSD || !fromAmountUSD) {
      return false
    }
    return fromAmountUSD < minFromAmountUSD
  }, [minFromAmountUSD, fromAmount, token?.priceUSD])

  return {
    belowMinFromAmountUSD,
    minFromAmountUSD,
  }
}
