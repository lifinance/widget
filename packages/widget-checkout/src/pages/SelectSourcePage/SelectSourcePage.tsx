import { parseUnits } from '@lifi/sdk'
import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import {
  FormKeyHelper,
  PoweredBy,
  useChain,
  useFieldValues,
  useHeader,
  useToken,
} from '@lifi/widget/shared'
import { useMeshBalance } from '@lifi/widget-provider-mesh'
import { Alert, Box } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { formatOnRampError } from '../../components/formatOnRampError.js'
import { Stack } from '../../components/Stack.js'
import {
  INTENT_FACTORY_ONLY,
  useCheckoutExchangesOverride,
} from '../../hooks/useCheckoutExchangesOverride.js'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { useSelectSourceTopWallets } from '../../hooks/useSelectSourceTopWallets.js'
import {
  useOnRampProviderByCategory,
  useOnRampSessionByCategory,
} from '../../providers/OnRampProvider/OnRampProvider.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { SelectSourceFundingOptions } from './SelectSourceFundingOptions.js'
import { SelectSourceMainColumn } from './SelectSourceLayout.js'

export const SelectSourcePage: React.FC = () => {
  const { t } = useTranslation()
  useHeader(t('checkout.chooseFundingSource'))
  const navigate = useCheckoutNavigate()
  const { openWalletMenu } = useWalletMenu()
  const { accounts } = useAccount()
  const cashSession = useOnRampSessionByCategory('cash')
  const exchangeSession = useOnRampSessionByCategory('exchange')
  const exchangeProvider = useOnRampProviderByCategory('exchange')
  const { topWallets, walletOverflowCount } = useSelectSourceTopWallets()
  const setFundingSource = useCheckoutFlowStore((s) => s.setFundingSource)
  const resetFlow = useCheckoutFlowStore((s) => s.reset)
  const overrideExchanges = useCheckoutExchangesOverride()

  // Capture fundingSource before resetFlow fires (runs after first render).
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const wasExchangeFlow = fundingSource === 'exchange'

  const formType = 'from' as const
  const [prevChainId, prevTokenAddress, prevAmountStr] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType),
    FormKeyHelper.getAmountKey(formType)
  )
  const { token: prevToken } = useToken(
    wasExchangeFlow ? prevChainId : undefined,
    wasExchangeFlow ? prevTokenAddress : undefined
  )
  const { chain: prevChain } = useChain(
    wasExchangeFlow ? prevChainId : undefined
  )
  const { rawBalance: meshRawBalance, decimals: meshDecimals } = useMeshBalance(
    wasExchangeFlow ? prevTokenAddress : undefined,
    wasExchangeFlow ? prevChainId : undefined
  )

  // Compare in raw base units with BigInt so high-decimal tokens (e.g. 18)
  // don't lose precision through Number(). `parseUnits` may throw on
  // malformed input — fall back to null so we never surface a false alert.
  const tokenDecimals = prevToken?.decimals ?? meshDecimals ?? null
  const prevRequestedRaw = useMemo<bigint | null>(() => {
    if (!prevAmountStr || tokenDecimals === null) {
      return null
    }
    try {
      return parseUnits(prevAmountStr, tokenDecimals)
    } catch {
      return null
    }
  }, [prevAmountStr, tokenDecimals])

  const showInsufficientFunds =
    wasExchangeFlow &&
    meshRawBalance !== null &&
    prevRequestedRaw !== null &&
    meshRawBalance < prevRequestedRaw

  useEffect(() => {
    resetFlow()
  }, [resetFlow])

  const payFromWalletAccount = useMemo(
    () => accounts.find((acct) => acct.isConnected && acct.address) ?? null,
    [accounts]
  )

  const hasWalletConnected = Boolean(payFromWalletAccount)

  const payFromWalletConnected = useMemo(() => {
    const a = payFromWalletAccount
    if (!a?.address) {
      return null
    }
    return {
      address: a.address,
      icon: a.connector?.icon,
      walletName:
        a.connector?.displayName ?? a.connector?.name ?? a.name ?? undefined,
    }
  }, [payFromWalletAccount])

  const goToToken = useCallback(() => {
    navigate({ to: checkoutNavigationRoutes.fromToken })
  }, [navigate])

  const prevHasWalletConnectedRef = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    const prev = prevHasWalletConnectedRef.current
    prevHasWalletConnectedRef.current = hasWalletConnected

    // After opening the wallet menu from this screen, skip staying on funding source —
    // go straight to token selection once the wallet connects.
    if (prev === false && hasWalletConnected) {
      goToToken()
    }
  }, [hasWalletConnected, goToToken])

  const handlePayFromWallet = useCallback(() => {
    setFundingSource('wallet')
    if (hasWalletConnected) {
      goToToken()
      return
    }
    openWalletMenu()
  }, [hasWalletConnected, goToToken, openWalletMenu, setFundingSource])

  const handleTransferCrypto = useCallback(() => {
    overrideExchanges([...INTENT_FACTORY_ONLY])
    setFundingSource('transfer')
    goToToken()
  }, [goToToken, overrideExchanges, setFundingSource])

  const handleConnectExchange = useCallback(() => {
    overrideExchanges([...INTENT_FACTORY_ONLY])
    setFundingSource('exchange')
    goToToken()
  }, [goToToken, overrideExchanges, setFundingSource])

  const handleDepositCash = useCallback(() => {
    overrideExchanges([...INTENT_FACTORY_ONLY])
    setFundingSource('cash')
    navigate({ to: checkoutNavigationRoutes.selectCash })
  }, [navigate, overrideExchanges, setFundingSource])

  const payFromWalletIcons = useMemo(
    () =>
      topWallets
        .filter((w) => Boolean(w.icon))
        .map((w) => ({
          key: w.id ?? w.name,
          src: w.icon as string,
        })),
    [topWallets]
  )

  return (
    <Stack
      sx={(theme) => ({
        bgcolor: theme.vars.palette.background.default,
      })}
    >
      <SelectSourceMainColumn sx={{ flex: 1 }}>
        {showInsufficientFunds && prevToken && prevChain ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('checkout.insufficientFunds', {
              symbol: prevToken.symbol,
              chain: prevChain.name,
            })}
          </Alert>
        ) : null}
        <SelectSourceFundingOptions
          onPayFromWallet={handlePayFromWallet}
          onTransferCrypto={handleTransferCrypto}
          onDepositCash={handleDepositCash}
          depositCashEnabled={Boolean(cashSession)}
          depositCashResolutionLoading={false}
          onConnectExchange={handleConnectExchange}
          showConnectExchange={Boolean(exchangeSession)}
          exchangeLoading={exchangeSession?.isLoading ?? false}
          exchangeError={formatOnRampError(
            exchangeSession?.error ?? null,
            exchangeProvider?.name ?? '',
            t
          )}
          payFromWalletIcons={payFromWalletIcons}
          payFromWalletOverflow={walletOverflowCount}
          payFromWalletConnected={payFromWalletConnected}
          payFromWalletAccount={payFromWalletAccount}
        />
        <Box sx={{ mt: 'auto', pt: 1, width: '100%' }}>
          <PoweredBy />
        </Box>
      </SelectSourceMainColumn>
    </Stack>
  )
}
