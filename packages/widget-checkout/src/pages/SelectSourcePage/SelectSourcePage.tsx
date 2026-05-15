import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import { PoweredBy, useHeader } from '@lifi/widget/shared'
import { Box } from '@mui/material'
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
