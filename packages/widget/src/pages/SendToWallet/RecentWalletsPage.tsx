import {
  ContentCopyRounded,
  DeleteOutline,
  History,
  MoreHoriz,
  OpenInNewRounded,
  TurnedInNot,
} from '@mui/icons-material'
import { ListItemAvatar, ListItemText, MenuItem } from '@mui/material'
import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AccountAvatar } from '../../components/Avatar/AccountAvatar.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { ListItem } from '../../components/ListItem/ListItem.js'
import { ListItemButton } from '../../components/ListItem/ListItemButton.js'
import { Menu } from '../../components/Menu.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import type { Bookmark } from '../../stores/bookmarks/types.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useBookmarks } from '../../stores/bookmarks/useBookmarks.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useSendToWalletActions } from '../../stores/settings/useSendToWalletStore.js'
import { defaultChainIdsByType } from '../../utils/chainType.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { shortenAddress } from '../../utils/wallet.js'
import { BookmarkAddressSheet } from './BookmarkAddressSheet.js'
import { EmptyListIndicator } from './EmptyListIndicator.js'
import {
  ListContainer,
  OptionsMenuButton,
  SendToWalletPageContainer,
} from './SendToWalletPage.style.js'

export const RecentWalletsPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedRecent, setSelectedRecent] = useState<Bookmark>()
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null)
  const { recentWallets } = useBookmarks()
  const { requiredToChainType } = useToAddressRequirements()
  const {
    removeRecentWallet,
    addBookmark,
    setSelectedBookmark,
    addRecentWallet,
  } = useBookmarkActions()
  const { setFieldValue } = useFieldActions()
  const { setSendToWallet } = useSendToWalletActions()
  const moreMenuId = useId()
  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>()
  const open = Boolean(moreMenuAnchorEl)
  const { getAddressLink } = useExplorer()

  useHeader(t('header.recentWallets'))

  const handleRecentSelected = (recentWallet: Bookmark) => {
    addRecentWallet(recentWallet)
    setFieldValue('toAddress', recentWallet.address, {
      isTouched: true,
      isDirty: true,
    })
    setSelectedBookmark(recentWallet)
    setSendToWallet(true)
    navigate('../../', {
      relative: 'path',
      replace: true,
    })
  }

  const handleAddBookmark = (bookmark: Bookmark) => {
    addBookmark(bookmark)
    navigate(`../${navigationRoutes.bookmarks}`, {
      relative: 'path',
      replace: true,
    })
  }

  const closeMenu = () => {
    setMenuAnchorEl(null)
  }

  const handleMenuOpen = (el: HTMLElement, recentWallet: Bookmark) => {
    setMenuAnchorEl(el)
    setSelectedRecent(recentWallet)
  }

  const handleCopyAddress = () => {
    if (selectedRecent) {
      navigator.clipboard.writeText(selectedRecent.address)
    }
    closeMenu()
  }

  const handleViewOnExplorer = () => {
    if (selectedRecent) {
      window.open(
        getAddressLink(
          selectedRecent.address,
          defaultChainIdsByType[selectedRecent.chainType]
        ),
        '_blank'
      )
    }
    closeMenu()
  }

  const handleOpenBookmarkSheet = () => {
    if (selectedRecent) {
      setSelectedRecent(selectedRecent)
      bookmarkAddressSheetRef.current?.open()
    }
    closeMenu()
  }

  const handleRemoveRecentWallet = () => {
    if (selectedRecent) {
      removeRecentWallet(selectedRecent.address)
    }
    closeMenu()
  }

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer>
        {recentWallets.map((recentWallet) => (
          <ListItem key={recentWallet.address} sx={{ position: 'relative' }}>
            <ListItemButton
              disabled={
                requiredToChainType &&
                requiredToChainType !== recentWallet.chainType
              }
              onClick={() => handleRecentSelected(recentWallet)}
            >
              <ListItemAvatar>
                <AccountAvatar
                  chainId={defaultChainIdsByType[recentWallet.chainType]}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  recentWallet.name || shortenAddress(recentWallet.address)
                }
                secondary={
                  recentWallet.name
                    ? shortenAddress(recentWallet.address)
                    : undefined
                }
              />
            </ListItemButton>
            <OptionsMenuButton
              aria-label={t('button.options')}
              aria-controls={
                open && recentWallet.address === selectedRecent?.address
                  ? moreMenuId
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) =>
                handleMenuOpen(e.target as HTMLElement, recentWallet)
              }
              sx={{
                opacity:
                  requiredToChainType &&
                  requiredToChainType !== recentWallet.chainType
                    ? 0.5
                    : 1,
              }}
            >
              <MoreHoriz fontSize="small" />
            </OptionsMenuButton>
          </ListItem>
        ))}
        {!recentWallets.length && (
          <EmptyListIndicator icon={<History sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noRecentWallets')}
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
          <MenuItem onClick={handleOpenBookmarkSheet}>
            <TurnedInNot />
            {t('button.bookmark')}
          </MenuItem>
          <MenuItem onClick={handleRemoveRecentWallet}>
            <DeleteOutline />
            {t('button.delete')}
          </MenuItem>
        </Menu>
      </ListContainer>
      <BookmarkAddressSheet
        ref={bookmarkAddressSheetRef}
        validatedWallet={selectedRecent}
        onAddBookmark={handleAddBookmark}
      />
    </SendToWalletPageContainer>
  )
}
