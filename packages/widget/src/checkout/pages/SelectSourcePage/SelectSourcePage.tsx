import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import { Box } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PoweredBy } from '../../../components/PoweredBy/PoweredBy.js'
import { useHeader } from '../../../hooks/useHeader.js'
import { Stack } from '../../components/Stack.js'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { useOnRamp } from '../../hooks/useOnRamp.js'
import { useSelectSourceTopWallets } from '../../hooks/useSelectSourceTopWallets.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { SelectSourceFundingOptions } from './SelectSourceFundingOptions.js'
import { SelectSourceMainColumn } from './SelectSourceLayout.js'

export const SelectSourcePage: React.FC = () => {
  const { t } = useTranslation()
  useHeader(t('checkout.chooseFundingSource'))
  const navigate = useCheckoutNavigate()
  const { openWalletMenu } = useWalletMenu()
  const { accounts } = useAccount()
  const { transak, getProvider, resolutionLoading, isAvailable } = useOnRamp()
  const mesh = getProvider('mesh')
  const { topWallets, walletOverflowCount } = useSelectSourceTopWallets()

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
    if (hasWalletConnected) {
      goToToken()
      return
    }
    openWalletMenu()
  }, [hasWalletConnected, goToToken, openWalletMenu])

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
          onTransferCrypto={goToToken}
          onDepositCash={() => transak?.openDepositFlow()}
          depositCashEnabled={Boolean(transak)}
          depositCashResolutionLoading={resolutionLoading}
          onConnectExchange={() => mesh?.openDepositFlow()}
          showConnectExchange={!resolutionLoading && isAvailable('mesh')}
          meshLoading={mesh?.isLoading ?? false}
          meshError={mesh?.error ?? null}
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
