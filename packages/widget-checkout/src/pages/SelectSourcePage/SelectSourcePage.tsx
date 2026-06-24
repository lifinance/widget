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
import { useFiatCurrencyStore } from '../../stores/useFiatCurrencyStore.js'
import {
  DEFAULT_FROM_CHAIN_ID,
  DEFAULT_FROM_TOKEN_ADDRESS,
} from '../../utils/checkoutDefaults.js'
import { isNativeToken } from '../../utils/nativeToken.js'
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
  const resetFiat = useFiatCurrencyStore((s) => s.reset)
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
    if (isNativeToken(prevTokenAddress)) {
      setFieldValue(FormKeyHelper.getChainKey('from'), DEFAULT_FROM_CHAIN_ID)
      setFieldValue(
        FormKeyHelper.getTokenKey('from'),
        DEFAULT_FROM_TOKEN_ADDRESS
      )
      setFieldValue(FormKeyHelper.getAmountKey('from'), '')
    }
    goToToken()
  }, [
    goToToken,
    overrideExchanges,
    prevTokenAddress,
    setFieldValue,
    setFundingSource,
  ])

  const pinExchangeSource = useCallback(() => {
    overrideExchanges([...INTENT_FACTORY_ONLY])
    setFundingSource('exchange')
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
    resetFiat()
    setFieldValue(FormKeyHelper.getChainKey('from'), DEFAULT_FROM_CHAIN_ID)
    setFieldValue(FormKeyHelper.getTokenKey('from'), DEFAULT_FROM_TOKEN_ADDRESS)
    setFieldValue(FormKeyHelper.getAmountKey('from'), '')
    setFieldValue(FormKeyHelper.getAmountKey('to'), '')
    setFieldValue('cashFiatAmount', '')
    navigate({ to: checkoutNavigationRoutes.selectCash })
  }, [navigate, overrideExchanges, resetFiat, setFieldValue, setFundingSource])

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
