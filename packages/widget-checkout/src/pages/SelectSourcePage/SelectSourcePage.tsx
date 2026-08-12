import {
  getConnectorIcon,
  useAccount,
  useWalletMenu,
} from '@lifi/wallet-management'
import {
  FormKeyHelper,
  PageContainer,
  PoweredBy,
  useFieldActions,
  useFieldValues,
  useHeader,
} from '@lifi/widget/shared'
import {
  type ConnectedCexAccount,
  connectedCexKey,
  useCheckoutConfig,
  useCheckoutUserId,
  useConnectedCexAccounts,
  useConnectedCexStore,
} from '@lifi/widget-provider/checkout'
import { Box, CircularProgress } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from '../../components/Stack.js'
import { useCheckoutActivity } from '../../hooks/useCheckoutActivity.js'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { useResumeCheckout } from '../../hooks/useResumeCheckout.js'
import { useSelectSourceTopWallets } from '../../hooks/useSelectSourceTopWallets.js'
import { useOnRampSessionByCategory } from '../../providers/OnRampProvider/OnRampProvider.js'
import { useCheckoutFlowStore } from '../../stores/useCheckoutFlowStore.js'
import { useFiatCurrencyStore } from '../../stores/useFiatCurrencyStore.js'
import {
  DEFAULT_FROM_CHAIN_ID,
  DEFAULT_FROM_TOKEN_ADDRESS,
} from '../../utils/checkoutDefaults.js'
import { isNativeToken } from '../../utils/nativeToken.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { pickAutoResumeItem } from '../../utils/pickAutoResumeItem.js'
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
  const { topWallets, walletOverflowCount } = useSelectSourceTopWallets()
  const setFundingSource = useCheckoutFlowStore((s) => s.setFundingSource)
  const setSelectedExchangeAccount = useCheckoutFlowStore(
    (s) => s.setSelectedExchangeAccount
  )
  const resetFlow = useCheckoutFlowStore((s) => s.reset)
  const resetFiat = useFiatCurrencyStore((s) => s.reset)
  const { setFieldValue } = useFieldActions()
  const { integrator } = useCheckoutConfig()
  const checkoutUserId = useCheckoutUserId()
  const connectedExchangeAccounts = useConnectedCexAccounts(
    exchangeSession ? connectedCexKey(integrator, checkoutUserId) : null
  )
  const removeConnectedExchangeAccount = useConnectedCexStore(
    (s) => s.removeAccount
  )

  const activityItems = useCheckoutActivity()
  const resumeCheckout = useResumeCheckout()
  const autoResumeItem = useMemo(
    () => pickAutoResumeItem(activityItems),
    [activityItems]
  )
  const autoResumedRef = useRef(false)
  useEffect(() => {
    if (autoResumedRef.current || !autoResumeItem) {
      return
    }
    autoResumedRef.current = true
    resumeCheckout(autoResumeItem)
  }, [autoResumeItem, resumeCheckout])

  const [prevTokenAddress] = useFieldValues(FormKeyHelper.getTokenKey('from'))

  useEffect(() => {
    // Skip while auto-resuming, else it clobbers the flow the resume just set.
    if (autoResumeItem) {
      return
    }
    resetFlow()
  }, [resetFlow, autoResumeItem])

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
      icon: getConnectorIcon(a.connector),
      walletName:
        a.connector?.displayName ?? a.connector?.name ?? a.name ?? undefined,
    }
  }, [payFromWalletAccount])

  const goToToken = useCallback(() => {
    navigate({ to: checkoutNavigationRoutes.fromToken })
  }, [navigate])

  // Navigate only after a connect this page initiated, not eager reconnects.
  const awaitingConnectRef = useRef(false)

  useEffect(() => {
    if (awaitingConnectRef.current && hasWalletConnected) {
      awaitingConnectRef.current = false
      goToToken()
    }
  }, [hasWalletConnected, goToToken])

  const handlePayFromWallet = useCallback(() => {
    setFundingSource('wallet')
    if (hasWalletConnected) {
      goToToken()
      return
    }
    awaitingConnectRef.current = true
    openWalletMenu()
  }, [hasWalletConnected, goToToken, openWalletMenu, setFundingSource])

  const handleTransferCrypto = useCallback(() => {
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
  }, [goToToken, prevTokenAddress, setFieldValue, setFundingSource])

  const pinExchangeSource = useCallback(() => {
    setFundingSource('exchange')
    setFieldValue(FormKeyHelper.getChainKey('from'), DEFAULT_FROM_CHAIN_ID)
    setFieldValue(FormKeyHelper.getTokenKey('from'), DEFAULT_FROM_TOKEN_ADDRESS)
    setFieldValue(FormKeyHelper.getAmountKey('from'), '')
  }, [setFieldValue, setFundingSource])

  const handleConnectExchange = useCallback(() => {
    setSelectedExchangeAccount(null)
    pinExchangeSource()
    goToToken()
  }, [goToToken, pinExchangeSource, setSelectedExchangeAccount])

  const handleReuseExchange = useCallback(
    (account: ConnectedCexAccount) => {
      if (account.expiresAt <= Date.now()) {
        // Token went stale since render — drop it and fall back to a fresh connect.
        removeConnectedExchangeAccount(
          connectedCexKey(integrator, checkoutUserId),
          account.accountId
        )
        handleConnectExchange()
        return
      }
      setSelectedExchangeAccount(account)
      pinExchangeSource()
      goToToken()
    },
    [
      goToToken,
      pinExchangeSource,
      setSelectedExchangeAccount,
      handleConnectExchange,
      removeConnectedExchangeAccount,
      integrator,
      checkoutUserId,
    ]
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
    setFundingSource('cash')
    resetFiat()
    setFieldValue(FormKeyHelper.getChainKey('from'), DEFAULT_FROM_CHAIN_ID)
    setFieldValue(FormKeyHelper.getTokenKey('from'), DEFAULT_FROM_TOKEN_ADDRESS)
    setFieldValue(FormKeyHelper.getAmountKey('from'), '')
    setFieldValue(FormKeyHelper.getAmountKey('to'), '')
    setFieldValue('cashFiatAmount', '')
    navigate({ to: checkoutNavigationRoutes.selectCash })
  }, [navigate, resetFiat, setFieldValue, setFundingSource])

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

  // Hold a loader rather than flash the funding options before redirecting.
  if (autoResumeItem) {
    return (
      <PageContainer bottomGutters>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  return (
    <Stack
      sx={(theme) => ({
        bgcolor: theme.vars.palette.background.default,
      })}
    >
      <SelectSourceMainColumn sx={{ flex: 1 }}>
        <CheckoutActivitySection />
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
