import {
  ChainSelect,
  FormKeyHelper,
  PageContainer,
  SearchTokenInput,
  useFieldValues,
  useHeader,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { Box, type Theme, useMediaQuery } from '@mui/material'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { useIsWalletFundedFlow } from '../../hooks/useIsWalletFundedFlow.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { SelectTokenList } from './SelectTokenList.js'

export const SelectTokenPage: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null)
  const navigate = useCheckoutNavigate()
  const { t } = useTranslation()
  const { mode, hiddenUI } = useWidgetConfig()
  const formType = 'from' as const

  const title = mode === 'custom' ? t('header.payWith') : t('header.from')

  useHeader(title)

  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const isWalletFunded = useIsWalletFundedFlow()
  const isExchangeFlow = fundingSource === 'exchange'
  // IF deposits can't accept the native gas token, so the curated set is ERC20-only.
  const exchangeAllowedSymbols = useMemo(() => new Set(['USDC', 'USDT']), [])
  const hideChainSelect = hiddenUI?.chainSelect || isExchangeFlow

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(theme.breakpoints.values.xs)
  )
  const hideSearchTokenInput = hiddenUI?.searchTokenInput || isExchangeFlow

  const hasHeader = !hideChainSelect || !hideSearchTokenInput

  const afterTokenSelect = () => {
    navigate({ to: checkoutNavigationRoutes.enterAmount })
  }

  const [toChainId, toTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('to'),
    FormKeyHelper.getTokenKey('to')
  )
  // Source token can't equal the fixed destination token; hide it from the list.
  const excludeToken = useMemo(
    () =>
      toChainId != null && toTokenAddress
        ? { chainId: Number(toChainId), address: String(toTokenAddress) }
        : undefined,
    [toChainId, toTokenAddress]
  )

  return (
    <PageContainer disableGutters>
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
      <SelectTokenList
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
        isWalletFunded={isWalletFunded}
        allowedSymbols={isExchangeFlow ? exchangeAllowedSymbols : undefined}
        excludeToken={excludeToken}
      />
    </PageContainer>
  )
}
