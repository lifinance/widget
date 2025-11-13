import { useAccount } from '@lifi/wallet-management'
import CloseRounded from '@mui/icons-material/CloseRounded'
import { Box, Collapse } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { type MouseEventHandler, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useBookmarks } from '../../stores/bookmarks/useBookmarks.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useSendToWalletStore } from '../../stores/settings/useSendToWalletStore.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import {
  defaultChainIdsByType,
  getChainTypeFromAddress,
} from '../../utils/chainType.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { shortenAddress } from '../../utils/wallet.js'
import { AccountAvatar } from '../Avatar/AccountAvatar.js'
import type { CardProps } from '../Card/Card.js'
import { Card } from '../Card/Card.js'
import { CardIconButton } from '../Card/CardIconButton.js'
import { CardTitle } from '../Card/CardTitle.js'
import { SendToWalletCardHeader } from './SendToWallet.style.js'

export const SendToWalletButton: React.FC<CardProps> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    disabledUI,
    hiddenUI,
    toAddress,
    toAddresses,
    subvariant,
    subvariantOptions,
  } = useWidgetConfig()
  const { showSendToWallet } = useSendToWalletStore((state) => state)
  const [toAddressFieldValue, toChainId, toTokenAddress] = useFieldValues(
    'toAddress',
    'toChain',
    'toToken'
  )
  const { setFieldValue } = useFieldActions()
  const { selectedBookmark } = useBookmarks()
  const { setSelectedBookmark } = useBookmarkActions()
  const { accounts } = useAccount()
  const { requiredToAddress } = useToAddressRequirements()
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress)
  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress)

  const address = toAddressFieldValue
    ? shortenAddress(toAddressFieldValue)
    : t('sendToWallet.enterAddress', {
        context: 'short',
      })

  const matchingConnectedAccount = accounts.find(
    (account) => account.address === toAddressFieldValue
  )

  const chainType = !matchingConnectedAccount
    ? selectedBookmark?.chainType ||
      (toAddressFieldValue
        ? getChainTypeFromAddress(toAddressFieldValue)
        : undefined)
    : undefined

  const chainId =
    toChainId && toTokenAddress
      ? toChainId
      : matchingConnectedAccount
        ? matchingConnectedAccount.chainId
        : chainType
          ? defaultChainIdsByType[chainType]
          : undefined

  const isConnectedAccount =
    selectedBookmark?.isConnectedAccount &&
    matchingConnectedAccount?.isConnected
  const connectedAccountName = matchingConnectedAccount?.connector?.name
  const bookmarkName = selectedBookmark?.name

  const headerTitle = isConnectedAccount
    ? connectedAccountName || address
    : bookmarkName || connectedAccountName || address

  const headerSubheader =
    isConnectedAccount || bookmarkName || connectedAccountName ? address : null

  const disabledForChanges = Boolean(toAddressFieldValue) && disabledToAddress

  const handleOnClick = () => {
    navigate({
      to: toAddresses?.length
        ? navigationRoutes.configuredWallets
        : navigationRoutes.sendToWallet,
    })
  }

  const clearSelectedBookmark: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setFieldValue('toAddress', '', { isTouched: true })
    setSelectedBookmark()
  }

  // The collapse opens instantly on first page load/component mount when there is an address to display
  // After which it needs an animated transition for open and closing.
  // collapseTransitionTime is used specify the transition time for opening and closing
  const collapseTransitionTime = useRef(0)

  // Timeout is needed here to push the collapseTransitionTime update to the back of the event loop so that it doesn't fired too quickly
  useEffect(() => {
    const timeout = setTimeout(() => {
      collapseTransitionTime.current = 225
    }, 0)
    return () => clearTimeout(timeout)
  }, [])

  const isOpenCollapse =
    !hiddenToAddress && (requiredToAddress || showSendToWallet)

  const title =
    subvariant === 'custom' && subvariantOptions?.custom === 'deposit'
      ? t('header.depositTo')
      : t('header.sendToWallet')

  return (
    <Collapse
      timeout={collapseTransitionTime.current as number}
      in={isOpenCollapse}
      mountOnEnter
      unmountOnExit
    >
      <Card
        role="button"
        onClick={disabledForChanges ? undefined : handleOnClick}
        sx={{ width: '100%', ...props.sx }}
      >
        <CardTitle required={requiredToAddress}>{title}</CardTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SendToWalletCardHeader
            avatar={
              <AccountAvatar
                chainId={chainId}
                account={matchingConnectedAccount}
                toAddress={toAddress}
                empty={!toAddressFieldValue}
              />
            }
            title={headerTitle}
            subheader={headerSubheader}
            selected={!!toAddressFieldValue || disabledToAddress}
            action={
              !!toAddressFieldValue && !disabledForChanges ? (
                <CardIconButton onClick={clearSelectedBookmark} size="small">
                  <CloseRounded fontSize="inherit" />
                </CardIconButton>
              ) : null
            }
          />
        </Box>
      </Card>
    </Collapse>
  )
}
