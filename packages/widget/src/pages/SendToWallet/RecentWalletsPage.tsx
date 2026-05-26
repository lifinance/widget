import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import DeleteOutline from '@mui/icons-material/DeleteOutlined'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import TurnedInNot from '@mui/icons-material/TurnedInNot'
import { List, ListItemAvatar, ListItemText } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { type JSX, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccountAvatar } from '../../components/Avatar/AccountAvatar.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { ContextMenu } from '../../components/ContextMenu.js'
import { EmptyListIndicator } from '../../components/EmptyListIndicator/EmptyListIndicator.js'
import { ListItem } from '../../components/ListItem/ListItem.js'
import { ListItemButton } from '../../components/ListItem/ListItemButton.js'
import { PageContainer } from '../../components/PageContainer.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import type { Bookmark } from '../../stores/bookmarks/types.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useBookmarks } from '../../stores/bookmarks/useBookmarks.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { defaultChainIdsByType } from '../../utils/chainType.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { shortenAddress } from '../../utils/wallet.js'
import { BookmarkAddressSheet } from './BookmarkAddressSheet.js'

export const RecentWalletsPage = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [bookmarkTarget, setBookmarkTarget] = useState<Bookmark>()
  const bookmarkAddressSheetRef = useRef<BottomSheetBase>(null)
  const listParentRef = useRef<HTMLUListElement | null>(null)
  const { recentWallets } = useBookmarks()
  const { requiredToChainType } = useToAddressRequirements()
  const {
    removeRecentWallet,
    addBookmark,
    setSelectedBookmark,
    addRecentWallet,
  } = useBookmarkActions()
  const { setFieldValue } = useFieldActions()
  const { getAddressLink } = useExplorer()

  useHeader(t('header.recentWallets'))

  const { listHeight } = useListHeight({ listParentRef })

  const handleRecentSelected = (recentWallet: Bookmark) => {
    addRecentWallet(recentWallet)
    setFieldValue('toAddress', recentWallet.address, {
      isTouched: true,
      isDirty: true,
    })
    setSelectedBookmark(recentWallet)
    navigate({
      to: navigationRoutes.home,
      replace: true,
    })
  }

  const handleAddBookmark = (bookmark: Bookmark) => {
    addBookmark(bookmark)
    navigate({ to: navigationRoutes.bookmarks, replace: true })
  }

  return (
    <PageContainer disableGutters>
      <List
        className="long-list"
        ref={listParentRef}
        style={{ height: listHeight, overflow: 'auto' }}
        disablePadding
      >
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
            <ContextMenu
              disabled={
                !!(
                  requiredToChainType &&
                  requiredToChainType !== recentWallet.chainType
                )
              }
              items={[
                {
                  icon: <ContentCopyRounded />,
                  label: t('button.copyAddress'),
                  onClick: () =>
                    navigator.clipboard.writeText(recentWallet.address),
                },
                {
                  icon: <OpenInNewRounded />,
                  label: t('button.viewOnExplorer'),
                  onClick: () =>
                    window.open(
                      getAddressLink(
                        recentWallet.address,
                        defaultChainIdsByType[recentWallet.chainType]
                      ),
                      '_blank'
                    ),
                },
                {
                  icon: <TurnedInNot />,
                  label: t('button.bookmark'),
                  onClick: () => {
                    setBookmarkTarget(recentWallet)
                    bookmarkAddressSheetRef.current?.open()
                  },
                },
                {
                  icon: <DeleteOutline />,
                  label: t('button.delete'),
                  onClick: () => removeRecentWallet(recentWallet.address),
                },
              ]}
            />
          </ListItem>
        ))}
        {!recentWallets.length && (
          <EmptyListIndicator
            icon={<AccountBalanceWalletIcon />}
            title={t('sendToWallet.noRecentWallets')}
            message={t('sendToWallet.noRecentWalletsMessage')}
          />
        )}
      </List>
      <BookmarkAddressSheet
        ref={bookmarkAddressSheetRef}
        validatedWallet={bookmarkTarget}
        onAddBookmark={handleAddBookmark}
      />
    </PageContainer>
  )
}
