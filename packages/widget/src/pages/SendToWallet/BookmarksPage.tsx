import {
  ContentCopyRounded,
  DeleteOutline,
  MoreHoriz,
  OpenInNewRounded,
  TurnedIn,
} from '@mui/icons-material'
import { Button, ListItemAvatar, ListItemText, MenuItem } from '@mui/material'
import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AccountAvatar } from '../../components/Avatar/AccountAvatar.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { ListItemButton } from '../../components/ListItem//ListItemButton.js'
import { ListItem } from '../../components/ListItem/ListItem.js'
import { Menu } from '../../components/Menu.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { Bookmark } from '../../stores/bookmarks/types.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useBookmarks } from '../../stores/bookmarks/useBookmarks.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useSendToWalletActions } from '../../stores/settings/useSendToWalletStore.js'
import { defaultChainIdsByType } from '../../utils/chainType.js'
import { shortenAddress } from '../../utils/wallet.js'
import { BookmarkAddressSheet } from './BookmarkAddressSheet.js'
import { EmptyListIndicator } from './EmptyListIndicator.js'
import {
  BookmarkButtonContainer,
  BookmarksListContainer,
  FullHeightAdjustablePageContainer,
  OptionsMenuButton,
} from './SendToWalletPage.style.js'

export const BookmarksPage = () => {
  const { t } = useTranslation()
  const [bookmark, setBookmark] = useState<Bookmark>()
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null)
  const { bookmarks } = useBookmarks()
  const { requiredToChainType } = useToAddressRequirements()
  const { addBookmark, removeBookmark, setSelectedBookmark } =
    useBookmarkActions()
  const navigate = useNavigate()
  const { setFieldValue } = useFieldActions()
  const { setSendToWallet } = useSendToWalletActions()
  const { variant } = useWidgetConfig()
  const { getAddressLink } = useExplorer()

  useHeader(t('header.bookmarkedWallets'))

  const handleAddBookmark = () => {
    bookmarkAddressSheetRef.current?.open()
  }

  const handleBookmarkSelected = (bookmark: Bookmark) => {
    setFieldValue('toAddress', bookmark.address, {
      isTouched: true,
      isDirty: true,
    })
    setSelectedBookmark(bookmark)
    setSendToWallet(true)
    navigate('../../', {
      relative: 'path',
      replace: true,
    })
  }

  const moreMenuId = useId()
  const [moreMenuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>()
  const open = Boolean(moreMenuAnchorEl)
  const closeMenu = () => {
    setMenuAnchorEl(null)
  }

  const handleMenuOpen = (el: HTMLElement, bookmark: Bookmark) => {
    setMenuAnchorEl(el)
    setBookmark(bookmark)
  }

  const handleCopyAddress = () => {
    if (bookmark) {
      navigator.clipboard.writeText(bookmark.address)
    }
    closeMenu()
  }

  const handleViewOnExplorer = () => {
    if (bookmark) {
      window.open(
        getAddressLink(
          bookmark.address,
          defaultChainIdsByType[bookmark.chainType]
        ),
        '_blank'
      )
    }
    closeMenu()
  }

  const handleRemoveBookmark = () => {
    if (bookmark) {
      removeBookmark(bookmark.address)
    }
    closeMenu()
  }

  return (
    <FullHeightAdjustablePageContainer
      disableGutters
      enableFullHeight={variant !== 'drawer'}
    >
      <BookmarksListContainer>
        {bookmarks.map((bookmark) => (
          <ListItem key={bookmark.address} sx={{ position: 'relative' }}>
            <ListItemButton
              onClick={() => handleBookmarkSelected(bookmark)}
              disabled={
                requiredToChainType &&
                requiredToChainType !== bookmark.chainType
              }
            >
              <ListItemAvatar>
                <AccountAvatar
                  chainId={defaultChainIdsByType[bookmark.chainType]}
                />
              </ListItemAvatar>
              <ListItemText
                primary={bookmark.name}
                secondary={shortenAddress(bookmark.address)}
              />
            </ListItemButton>
            <OptionsMenuButton
              aria-label={t('button.options')}
              aria-controls={
                open && bookmark.address === bookmark?.address
                  ? moreMenuId
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) => handleMenuOpen(e.target as HTMLElement, bookmark)}
              sx={{
                opacity:
                  requiredToChainType &&
                  requiredToChainType !== bookmark.chainType
                    ? 0.5
                    : 1,
              }}
            >
              <MoreHoriz fontSize="small" />
            </OptionsMenuButton>
          </ListItem>
        ))}
        {!bookmarks.length && (
          <EmptyListIndicator icon={<TurnedIn sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noBookmarkedWallets')}
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
          <MenuItem onClick={handleRemoveBookmark}>
            <DeleteOutline />
            {t('button.delete')}
          </MenuItem>
        </Menu>
      </BookmarksListContainer>
      <BookmarkButtonContainer>
        <Button variant="contained" onClick={handleAddBookmark}>
          {t('sendToWallet.addBookmark')}
        </Button>
      </BookmarkButtonContainer>
      <BookmarkAddressSheet
        ref={bookmarkAddressSheetRef}
        onAddBookmark={addBookmark}
      />
    </FullHeightAdjustablePageContainer>
  )
}
