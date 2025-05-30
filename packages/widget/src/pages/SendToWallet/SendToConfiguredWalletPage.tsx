import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { ListItemAvatar, ListItemText, MenuItem } from '@mui/material'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccountAvatar } from '../../components/Avatar/AccountAvatar.js'
import { ListItem } from '../../components/ListItem/ListItem.js'
import { ListItemButton } from '../../components/ListItem/ListItemButton.js'
import { Menu } from '../../components/Menu.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import type { ToAddress } from '../../types/widget.js'
import { defaultChainIdsByType } from '../../utils/chainType.js'
import { shortenAddress } from '../../utils/wallet.js'
import {
  ListContainer,
  OptionsMenuButton,
  SendToWalletPageContainer,
} from './SendToWalletPage.style.js'

export const SendToConfiguredWalletPage = () => {
  const { t } = useTranslation()
  const { navigateBack } = useNavigateBack()
  const { toAddresses } = useWidgetConfig()
  const [selectedToAddress, setSelectedToAddress] = useState<ToAddress>()
  const { requiredToChainType } = useToAddressRequirements()
  const { setSelectedBookmark } = useBookmarkActions()
  const { setFieldValue } = useFieldActions()
  const moreMenuId = useId()
  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>()
  const open = Boolean(moreMenuAnchorEl)
  const { getAddressLink } = useExplorer()

  useHeader(t('header.sendToWallet'))

  const handleCuratedSelected = (toAddress: ToAddress) => {
    setSelectedBookmark(toAddress)
    setFieldValue('toAddress', toAddress.address, {
      isTouched: true,
      isDirty: true,
    })
    navigateBack()
  }

  const closeMenu = () => {
    setMenuAnchorEl(null)
  }

  const handleMenuOpen = (el: HTMLElement, toAddress: ToAddress) => {
    setMenuAnchorEl(el)
    setSelectedToAddress(toAddress)
  }

  const handleCopyAddress = () => {
    if (selectedToAddress) {
      navigator.clipboard.writeText(selectedToAddress.address)
    }
    closeMenu()
  }

  const handleViewOnExplorer = () => {
    if (selectedToAddress) {
      window.open(
        getAddressLink(
          selectedToAddress.address,
          defaultChainIdsByType[selectedToAddress.chainType]
        ),
        '_blank'
      )
    }
    closeMenu()
  }

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer sx={{ minHeight: 418 }}>
        {toAddresses?.map((toAddress) => (
          <ListItem key={toAddress.address} sx={{ position: 'relative' }}>
            <ListItemButton
              disabled={
                requiredToChainType &&
                requiredToChainType !== toAddress.chainType
              }
              onClick={() => handleCuratedSelected(toAddress)}
            >
              <ListItemAvatar>
                <AccountAvatar
                  chainId={defaultChainIdsByType[toAddress.chainType]}
                  toAddress={toAddress}
                />
              </ListItemAvatar>
              <ListItemText
                primary={toAddress.name || shortenAddress(toAddress.address)}
                secondary={
                  toAddress.name ? shortenAddress(toAddress.address) : undefined
                }
              />
            </ListItemButton>
            <OptionsMenuButton
              aria-label={t('button.options')}
              aria-controls={
                open && toAddress.address === selectedToAddress?.address
                  ? moreMenuId
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) =>
                handleMenuOpen(e.target as HTMLElement, toAddress)
              }
              sx={{
                opacity:
                  requiredToChainType &&
                  requiredToChainType !== toAddress.chainType
                    ? 0.5
                    : 1,
              }}
            >
              <MoreHoriz fontSize="small" />
            </OptionsMenuButton>
          </ListItem>
        ))}
        <Menu
          id={moreMenuId}
          elevation={0}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorEl={moreMenuAnchorEl}
          open={open}
          onClose={closeMenu}
        >
          <MenuItem onClick={handleCopyAddress}>
            <ContentCopyRounded />
            {t('button.copyAddress')}
          </MenuItem>
          <MenuItem onClick={handleViewOnExplorer}>
            <OpenInNewRounded />
            {t('button.viewOnExplorer')}
          </MenuItem>
        </Menu>
      </ListContainer>
    </SendToWalletPageContainer>
  )
}
