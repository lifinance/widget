import { parseUnits } from '@lifi/sdk'
import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import {
  FormKeyHelper,
  PoweredBy,
  useChain,
  useFieldActions,
  useFieldValues,
  useHeader,
  useToken,
} from '@lifi/widget/shared'
import {
  type ConnectedCexAccount,
  connectedCexKey,
  useCheckoutConfig,
  useCheckoutUserId,
  useConnectedCexAccounts,
  useConnectedCexStore,
} from '@lifi/widget-provider/checkout'
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
import {
  DEFAULT_FROM_CHAIN_ID,
  DEFAULT_FROM_TOKEN_ADDRESS,
} from '../../utils/checkoutDefaults.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { CheckoutActivitySection } from './CheckoutActivitySection.js'
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
  const setSelectedExchangeAccount = useCheckoutFlowStore(
    (s) => s.setSelectedExchangeAccount
  )
  const resetFlow = useCheckoutFlowStore((s) => s.reset)
  const overrideExchanges = useCheckoutExchangesOverride()
  const { setFieldValue } = useFieldActions()
  const { integrator } = useCheckoutConfig()
  const checkoutUserId = useCheckoutUserId()
  const connectedExchangeAccounts = useConnectedCexAccounts(
    exchangeSession ? connectedCexKey(integrator, checkoutUserId) : null
  )
  const removeConnectedExchangeAccount = useConnectedCexStore(
    (s) => s.removeAccount
  )

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
    // The wallet flow pays directly from the connected wallet, so it keeps the
    // integrator's full route set — no IF-only override (unlike the deposit flows).
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

  const pinExchangeSource = useCallback(() => {
    overrideExchanges([...INTENT_FACTORY_ONLY])
    setFundingSource('exchange')
    // Exchange deposits are limited to USDC/USDT/ETH on mainnet — pin the
    // from-chain and seed a valid mainnet token so a stale non-mainnet
    // selection doesn't leak into the curated token list, balance, or quote.
    setFieldValue(FormKeyHelper.getChainKey('from'), DEFAULT_FROM_CHAIN_ID)
    setFieldValue(FormKeyHelper.getTokenKey('from'), DEFAULT_FROM_TOKEN_ADDRESS)
    setFieldValue(FormKeyHelper.getAmountKey('from'), '')
  }, [overrideExchanges, setFieldValue, setFundingSource])

  const handleConnectExchange = useCallback(() => {
    setSelectedExchangeAccount(null)
    pinExchangeSource()
    goToToken()
  }, [goToToken, pinExchangeSource, setSelectedExchangeAccount])

  const handleReuseExchange = useCallback(
    (account: ConnectedCexAccount) => {
      // ConnectedCexAccount is a superset of OnRampAccessToken — pass through.
      setSelectedExchangeAccount(account)
      pinExchangeSource()
      goToToken()
    },
    [goToToken, pinExchangeSource, setSelectedExchangeAccount]
  )

  const handleForgetExchange = useCallback(
    (account: ConnectedCexAccount) => {
      removeConnectedExchangeAccount(
        connectedCexKey(integrator, checkoutUserId),
        account.accountId
      )
    },
    [removeConnectedExchangeAccount, integrator, checkoutUserId]
  )

  const handleDepositCash = useCallback(() => {
    overrideExchanges([...INTENT_FACTORY_ONLY])
    setFundingSource('cash')
    // Cash deposits aren't wallet-funded, so seed the from-token to USDC on
    // mainnet — otherwise the form keeps the prior wallet/transfer selection
    // (default ETH) and the quote, balance, and Transak session all run
    // against the wrong token.
    setFieldValue(FormKeyHelper.getChainKey('from'), DEFAULT_FROM_CHAIN_ID)
    setFieldValue(FormKeyHelper.getTokenKey('from'), DEFAULT_FROM_TOKEN_ADDRESS)
    setFieldValue(FormKeyHelper.getAmountKey('from'), '')
    navigate({ to: checkoutNavigationRoutes.selectCash })
  }, [navigate, overrideExchanges, setFieldValue, setFundingSource])

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
        <CheckoutActivitySection />
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
          showDepositCash={Boolean(cashSession)}
          onConnectExchange={handleConnectExchange}
          showConnectExchange={Boolean(exchangeSession)}
          connectedExchangeAccounts={connectedExchangeAccounts}
          onReuseExchange={handleReuseExchange}
          onForgetExchange={handleForgetExchange}
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
