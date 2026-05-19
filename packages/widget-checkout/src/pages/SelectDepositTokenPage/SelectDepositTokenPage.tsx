import { parseUnits } from '@lifi/sdk'
import {
  ChainSelect,
  FormKeyHelper,
  FullPageContainer,
  HiddenUI,
  SearchTokenInput,
  useChain,
  useFieldValues,
  useHeader,
  useScrollableOverflowHidden,
  useToken,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { useMeshBalance } from '@lifi/widget-provider-mesh'
import { Alert, Box, type Theme, useMediaQuery } from '@mui/material'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { SelectDepositTokenList } from './SelectDepositTokenList.js'

export const SelectDepositTokenPage: React.FC = () => {
  useScrollableOverflowHidden()

  const headerRef = useRef<HTMLElement>(null)
  const navigate = useCheckoutNavigate()
  const { t } = useTranslation()
  const { subvariant, hiddenUI } = useWidgetConfig()
  const formType = 'from' as const

  const title = subvariant === 'custom' ? t('header.payWith') : t('header.from')

  useHeader(title)

  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const isExchangeFlow = fundingSource === 'exchange'
  const exchangeAllowedSymbols = useMemo(
    () => new Set(['USDC', 'USDT', 'ETH']),
    []
  )
  const hideChainSelect =
    hiddenUI?.includes(HiddenUI.ChainSelect) || isExchangeFlow

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(theme.breakpoints.values.xs)
  )
  const hideSearchTokenInput =
    hiddenUI?.includes(HiddenUI.SearchTokenInput) || isExchangeFlow

  const hasHeader = !hideChainSelect || !hideSearchTokenInput

  const afterTokenSelect = () => {
    navigate({ to: checkoutNavigationRoutes.enterAmount })
  }

  const [selectedChainId, selectedTokenAddress, fromAmountStr] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType),
    FormKeyHelper.getAmountKey(formType)
  )
  const { token: selectedToken } = useToken(
    isExchangeFlow ? selectedChainId : undefined,
    isExchangeFlow ? selectedTokenAddress : undefined
  )
  const { chain: selectedChain } = useChain(
    isExchangeFlow ? selectedChainId : undefined
  )
  const { rawBalance: meshRawBalance, decimals: meshDecimals } = useMeshBalance(
    isExchangeFlow ? selectedTokenAddress : undefined,
    isExchangeFlow ? selectedChainId : undefined
  )

  const tokenDecimals = selectedToken?.decimals ?? meshDecimals ?? null
  const requestedRaw = useMemo<bigint | null>(() => {
    if (!fromAmountStr || tokenDecimals === null) {
      return null
    }
    try {
      return parseUnits(fromAmountStr, tokenDecimals)
    } catch {
      return null
    }
  }, [fromAmountStr, tokenDecimals])
  const showInsufficientFunds =
    isExchangeFlow &&
    meshRawBalance !== null &&
    requestedRaw !== null &&
    meshRawBalance < requestedRaw

  return (
    <FullPageContainer disableGutters>
      {showInsufficientFunds && selectedToken && selectedChain ? (
        <Box sx={{ px: 3, pt: 2 }}>
          <Alert severity="warning">
            {t('checkout.insufficientFunds', {
              symbol: selectedToken.symbol,
              chain: selectedChain.name,
            })}
          </Alert>
        </Box>
      ) : null}
      <Box
        ref={headerRef}
        sx={{
          pt: hasHeader ? 2 : 0,
          pb: hasHeader ? 2 : 0,
          px: 3,
        }}
      >
        {!hideChainSelect ? <ChainSelect formType={formType} /> : null}
        {!hideSearchTokenInput && (
          <Box
            sx={{
              mt: !hideChainSelect ? 2 : 0,
            }}
          >
            <SearchTokenInput formType={formType} />
          </Box>
        )}
      </Box>
      <SelectDepositTokenList
        key={
          hideChainSelect
            ? 'without-offset'
            : isMobile
              ? 'with-offset-mobile'
              : 'with-offset'
        }
        headerRef={headerRef}
        formType={formType}
        afterTokenSelect={afterTokenSelect}
        allowedSymbols={isExchangeFlow ? exchangeAllowedSymbols : undefined}
      />
    </FullPageContainer>
  )
}
