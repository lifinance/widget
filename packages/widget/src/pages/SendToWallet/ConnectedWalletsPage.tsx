import { useAccount } from '@lifi/wallet-management'
import type { Account } from '@lifi/widget-provider'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import Wallet from '@mui/icons-material/Wallet'
import { ListItemAvatar, ListItemText } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { AccountAvatar } from '../../components/Avatar/AccountAvatar.js'
import { ContextMenu } from '../../components/ContextMenu.js'
import { ListItem } from '../../components/ListItem/ListItem.js'
import { ListItemButton } from '../../components/ListItem/ListItemButton.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { shortenAddress } from '../../utils/wallet.js'
import { EmptyListIndicator } from './EmptyListIndicator.js'
import {
  ListContainer,
  SendToWalletPageContainer,
} from './SendToWalletPage.style.js'

export const ConnectedWalletsPage = (): JSX.Element => {
  const { t } = useTranslation()
  const { accounts } = useAccount()
  const { setSelectedBookmark } = useBookmarkActions()
  const { requiredToChainType } = useToAddressRequirements()
  const navigate = useNavigate()
  const { setFieldValue } = useFieldActions()
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
    navigate({
      to: navigationRoutes.home,
      replace: true,
    })
  }

  return (
    <SendToWalletPageContainer disableGutters>
      <ListContainer>
        {accounts.map((account) => {
          const walletAddress = shortenAddress(account.address)
          const menuItems = [
            {
              icon: <ContentCopyRounded />,
              label: t('button.copyAddress'),
              onClick: () => {
                if (account.address) {
                  navigator.clipboard.writeText(account.address)
                }
              },
            },
            ...(account.chainId
              ? [
                  {
                    icon: <OpenInNewRounded />,
                    label: t('button.viewOnExplorer'),
                    onClick: () => {
                      if (account.address) {
                        window.open(
                          getAddressLink(account.address, account.chainId),
                          '_blank'
                        )
                      }
                    },
                  },
                ]
              : []),
          ]

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
              <ContextMenu
                items={menuItems}
                disabled={
                  !!(
                    requiredToChainType &&
                    requiredToChainType !== account.chainType
                  )
                }
              />
            </ListItem>
          )
        })}
        {!accounts.length && (
          <EmptyListIndicator icon={<Wallet sx={{ fontSize: 48 }} />}>
            {t('sendToWallet.noConnectedWallets')}
          </EmptyListIndicator>
        )}
      </ListContainer>
    </SendToWalletPageContainer>
  )
}
