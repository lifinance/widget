import { useAccount, useWalletMenu } from '@lifi/wallet-management'
import {
  isDestinationOnlyChain,
  PageContainer,
  shortenAddress,
  useAddressValidation,
  useChain,
  useFieldActions,
  useHeader,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { useAddressForChain } from '@lifi/widget-provider'
import WalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import {
  type JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { useResolvedCheckoutRecipient } from '../../hooks/useResolvedCheckoutRecipient.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'

export const SetDestinationAddressPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  useHeader(t('checkout.whereToSendIt'))
  const navigate = useCheckoutNavigate()
  const { toChain } = useWidgetConfig()
  const { chain: destinationChain } = useChain(toChain)
  const { validateAddress, isValidating } = useAddressValidation()
  const { recipient, setUserRecipient } = useResolvedCheckoutRecipient()
  const { setFieldValue } = useFieldActions()
  const { openWalletMenu } = useWalletMenu()
  const { accounts } = useAccount()
  const { isAddressForChain } = useAddressForChain()
  // No wallet can connect on a destination-only chain, so offer only the field.
  const canUseWallet = !isDestinationOnlyChain(destinationChain?.id)

  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const commitRecipient = useCallback(
    (
      address: string,
      chainType: NonNullable<typeof destinationChain>['chainType']
    ) => {
      setUserRecipient({ address, chainType })
      // Seed the form now so the route query has the recipient on the next render.
      setFieldValue('toAddress', address, { isDirty: false, isTouched: true })
      // Replace so Back from enter-amount skips this screen.
      navigate({ to: checkoutNavigationRoutes.enterAmount, replace: true })
    },
    [setUserRecipient, setFieldValue, navigate]
  )

  const handleDone = useCallback(async () => {
    setError(null)
    const result = await validateAddress({
      value: value.trim(),
      chain: destinationChain,
    })
    if (!result.isValid) {
      setError(result.error)
      return
    }
    commitRecipient(result.address, result.chainType)
  }, [value, destinationChain, validateAddress, commitRecipient])

  // Adopt the first connected account matching the destination ecosystem after connect.
  const awaitingConnectRef = useRef(false)
  const handleConnectWallet = useCallback(() => {
    awaitingConnectRef.current = true
    openWalletMenu()
  }, [openWalletMenu])

  useEffect(() => {
    if (!awaitingConnectRef.current || !destinationChain) {
      return
    }
    const match = accounts.find(
      (a) =>
        a.isConnected &&
        a.address &&
        isAddressForChain(a.address, destinationChain)
    )
    if (match?.address) {
      awaitingConnectRef.current = false
      commitRecipient(match.address, destinationChain.chainType)
    }
  }, [accounts, destinationChain, commitRecipient, isAddressForChain])

  // Connected wallets in the destination ecosystem, offered as one-tap recipients.
  const connectedAccounts = useMemo(() => {
    const byAddress = new Map<string, (typeof accounts)[number]>()
    for (const account of accounts) {
      if (
        account.isConnected &&
        account.address &&
        destinationChain &&
        isAddressForChain(account.address, destinationChain)
      ) {
        byAddress.set(account.address.toLowerCase(), account)
      }
    }
    return [...byAddress.values()]
  }, [accounts, destinationChain, isAddressForChain])

  return (
    <PageContainer bottomGutters>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        <TextField
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(null)
          }}
          placeholder={t('checkout.walletAddressOrEns')}
          error={Boolean(error)}
          helperText={error ?? undefined}
          multiline
          minRows={2}
          fullWidth
          slotProps={{
            htmlInput: { 'aria-label': t('checkout.whereToSendIt') },
          }}
        />
        <Button
          variant="contained"
          fullWidth
          disabled={!value.trim() || isValidating}
          onClick={handleDone}
        >
          {t('button.done')}
        </Button>
        {canUseWallet ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {t('checkout.or')}
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>
            {connectedAccounts.map((account) => {
              const name =
                account.connector?.displayName ??
                account.connector?.name ??
                account.name
              const shortAddress = shortenAddress(account.address)
              const isSelected =
                recipient?.address?.toLowerCase() ===
                account.address?.toLowerCase()
              return (
                <ListItemButton
                  key={account.address}
                  selected={isSelected}
                  onClick={() => {
                    if (account.address) {
                      commitRecipient(account.address, account.chainType)
                    }
                  }}
                  sx={{ borderRadius: 3, height: 56 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      src={account.connector?.icon}
                      sx={{ width: 24, height: 24 }}
                    >
                      <WalletOutlinedIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={name ?? shortAddress}
                    secondary={name ? shortAddress : undefined}
                    slotProps={{ primary: { sx: { fontWeight: 500 } } }}
                  />
                </ListItemButton>
              )
            })}
            <ListItemButton
              onClick={handleConnectWallet}
              sx={{ borderRadius: 3, height: 56 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <WalletOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={t(
                  connectedAccounts.length
                    ? 'checkout.useAnotherWallet'
                    : 'checkout.connectWallet'
                )}
                slotProps={{ primary: { sx: { fontWeight: 500 } } }}
              />
            </ListItemButton>
          </>
        ) : null}
      </Box>
    </PageContainer>
  )
}
