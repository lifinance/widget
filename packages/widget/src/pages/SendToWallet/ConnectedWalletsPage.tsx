import type { Account } from '@lifi/wallet-management'
import { useAccount } from '@lifi/wallet-management'
import {
  ContentCopyRounded,
  MoreHoriz,
  OpenInNewRounded,
  Wallet,
} from '@mui/icons-material'
import { ListItemAvatar, ListItemText, MenuItem } from '@mui/material'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AccountAvatar } from '../../components/Avatar/AccountAvatar.js'
import { ListItem } from '../../components/ListItem/ListItem.js'
import { ListItemButton } from '../../components/ListItem/ListItemButton.js'
import { Menu } from '../../components/Menu.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useSendToWalletActions } from '../../stores/settings/useSendToWalletStore.js'
import { shortenAddress } from '../../utils/wallet.js'
import { EmptyListIndicator } from './EmptyListIndicator.js'
import {
  ListContainer,
  OptionsMenuButton,
  SendToWalletPageContainer,
} from './SendToWalletPage.style.js'

export const ConnectedWalletsPage = () => {
  const { t } = useTranslation()
  const [selectedAccount, setSelectedAccount] = useState<Account>()
  const { accounts } = useAccount()
  const { setSelectedBookmark } = useBookmarkActions()
  const { requiredToChainType } = useToAddressRequirements()
  const navigate = useNavigate()
  const { setFieldValue } = useFieldActions()
  const { setSendToWallet } = useSendToWalletActions()
  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>()
  const moreMenuId = useId()
  const open = Boolean(moreMenuAnchorEl)
  const { getAddressLink } = useExplorer()

  useHeader(t('sendToWallet.connectedWallets'))

  const handleWalletSelected = (account: Account) => {
    setFieldValue('toAddress', account.address!, {
      isTouched: true,
      isDirty: true,
    })
    setSelectedBookmark({
      name: account.connector?.name,
      address: account.address!,
      chainType: account.chainType!,
      isConnectedAccount: true,
    })
    setSendToWallet(true)
    navigate('../../', {
      relative: 'path',
      replace: true,
    })
  }

  const closeMenu = () => {
    setMenuAnchorEl(null)
  }

  const handleMenuOpen = (el: HTMLElement, connectedWallet: Account) => {
    setMenuAnchorEl(el)
    setSelectedAccount(connectedWallet)
  }

  const handleCopyAddress = () => {
    if (selectedAccount?.address) {
      navigator.clipboard.writeText(selectedAccount.address)
    }
    closeMenu()
  }

  const handleViewOnExplorer = () => {
    if (selectedAccount?.chainId) {
      if (selectedAccount.address) {
        window.open(
          getAddressLink(selectedAccount.address, selectedAccount.chainId),
          '_blank'
        )
      }
    }
    closeMenu()
  }

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer>
        {accounts.map((account) => {
          const walletAddress = shortenAddress(account.address)

          return (
            <ListItem key={account.address} sx={{ position: 'relative' }}>
              <ListItemButton
                onClick={() => handleWalletSelected(account)}
                disabled={
                  requiredToChainType &&
                  requiredToChainType !== account.chainType
                }
              >
                <ListItemAvatar>
                  <AccountAvatar chainId={account.chainId} account={account} />
                </ListItemAvatar>
                <ListItemText
                  primary={account.connector?.name}
                  secondary={walletAddress}
                />
              </ListItemButton>
              <OptionsMenuButton
                aria-label={t('button.options')}
                aria-controls={
                  open && account.address === selectedAccount?.address
                    ? moreMenuId
                    : undefined
                }
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) =>
                  handleMenuOpen(e.target as HTMLElement, account)
                }
                sx={{
                  opacity:
                    requiredToChainType &&
                    requiredToChainType !== account.chainType
                      ? 0.5
                      : 1,
                }}
              >
                <MoreHoriz fontSize="small" />
              </OptionsMenuButton>
            </ListItem>
          )
        })}
        {!accounts.length && (
          <EmptyListIndicator icon={<Wallet sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noConnectedWallets')}
          </EmptyListIndicator>
        )}
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
