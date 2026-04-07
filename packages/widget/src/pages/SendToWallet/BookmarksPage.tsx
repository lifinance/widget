import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import TurnedIn from '@mui/icons-material/TurnedIn'
import { Button, ListItemAvatar, ListItemText } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { type JSX, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AccountAvatar } from '../../components/Avatar/AccountAvatar.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { ContextMenu } from '../../components/ContextMenu.js'
import { ListItem } from '../../components/ListItem/ListItem.js'
import { ListItemButton } from '../../components/ListItem//ListItemButton.js'
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
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { shortenAddress } from '../../utils/wallet.js'
import { BookmarkAddressSheet } from './BookmarkAddressSheet.js'
import { EmptyListIndicator } from './EmptyListIndicator.js'
import {
  BookmarkButtonContainer,
  BookmarksListContainer,
  FullHeightAdjustablePageContainer,
} from './SendToWalletPage.style.js'

export const BookmarksPage = (): JSX.Element => {
  const { t } = useTranslation()
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
    navigate({ to: navigationRoutes.home, replace: true })
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
            <ContextMenu
              disabled={
                !!(
                  requiredToChainType &&
                  requiredToChainType !== bookmark.chainType
                )
              }
              items={[
                {
                  icon: <ContentCopyRounded />,
                  label: t('button.copyAddress'),
                  onClick: () =>
                    navigator.clipboard.writeText(bookmark.address),
                },
                {
                  icon: <OpenInNewRounded />,
                  label: t('button.viewOnExplorer'),
                  onClick: () =>
                    window.open(
                      getAddressLink(
                        bookmark.address,
                        defaultChainIdsByType[bookmark.chainType]
                      ),
                      '_blank'
                    ),
                },
                {
                  icon: <DeleteOutline />,
                  label: t('button.delete'),
                  onClick: () => removeBookmark(bookmark.address),
                },
              ]}
            />
          </ListItem>
        ))}
        {!bookmarks.length && (
          <EmptyListIndicator icon={<TurnedIn sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noBookmarkedWallets')}
          </EmptyListIndicator>
        )}
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
