import { useAccount } from '@lifi/wallet-management'
import { useChainTypeFromAddress } from '@lifi/widget-provider'
import Close from '@mui/icons-material/Close'
import Wallet from '@mui/icons-material/Wallet'
import { Box, IconButton, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useBookmarks } from '../../stores/bookmarks/useBookmarks.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import { defaultChainIdsByType } from '../../utils/chainType.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { shortenAddress } from '../../utils/wallet.js'
import { AccountAvatar } from '../Avatar/AccountAvatar.js'
import { ButtonChip } from '../ButtonChip/ButtonChip.js'

export const AmountInputHeaderBadge: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    subvariant,
    subvariantOptions,
    toAddress,
    toAddresses,
    disabledUI,
    hiddenUI,
  } = useWidgetConfig()
  const { setFieldValue } = useFieldActions()
  const [toAddressValue, toChainId, toTokenAddress] = useFieldValues(
    'toAddress',
    'toChain',
    'toToken'
  )
  const { selectedBookmark } = useBookmarks()
  const { setSelectedBookmark } = useBookmarkActions()
  const { accounts } = useAccount()
  const { getChainTypeFromAddress } = useChainTypeFromAddress()

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress)
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress)
  const showWalletBadge =
    !hiddenToAddress && !(disabledToAddress && !toAddressValue)

  if (!showWalletBadge) {
    return null
  }

  const label =
    subvariant === 'custom' && subvariantOptions?.custom === 'deposit'
      ? t('header.depositTo')
      : t('header.sendToWallet')

  const handleClick = disabledToAddress
    ? undefined
    : () =>
        navigate({
          to: toAddresses?.length
            ? navigationRoutes.configuredWallets
            : navigationRoutes.sendToWallet,
        })

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation()
    setFieldValue('toAddress', '', { isTouched: true })
    setSelectedBookmark()
  }

  const matchingConnectedAccount = accounts.find(
    (account) => account.address === toAddressValue
  )

  const chainType = !matchingConnectedAccount
    ? selectedBookmark?.chainType ||
      (toAddressValue ? getChainTypeFromAddress(toAddressValue) : undefined)
    : undefined

  const chainId =
    toChainId && toTokenAddress
      ? toChainId
      : matchingConnectedAccount
        ? matchingConnectedAccount.chainId
        : chainType
          ? defaultChainIdsByType[chainType]
          : undefined

  return (
    <ButtonChip
      onClick={handleClick}
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        borderRadius: theme.shape.borderRadius,
        height: 32,
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {toAddressValue ? (
          <AccountAvatar
            chainId={chainId}
            account={matchingConnectedAccount}
            toAddress={toAddress}
            empty={!toAddressValue}
            size={20}
            badgeSize={10}
            badgeBorderWidthPx={1.5}
          />
        ) : null}
        <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.334 }}>
          {toAddressValue ? shortenAddress(toAddressValue) : label}
        </Typography>
      </Box>
      {toAddressValue && !disabledToAddress ? (
        <IconButton onClick={handleRemove} size="small" sx={{ mr: -1, p: 0.5 }}>
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      ) : (
        <Wallet sx={{ fontSize: 16 }} />
      )}
    </ButtonChip>
  )
}
