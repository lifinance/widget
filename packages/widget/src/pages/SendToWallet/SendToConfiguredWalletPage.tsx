import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { List, ListItemAvatar, ListItemText } from '@mui/material'
import { type JSX, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AccountAvatar } from '../../components/Avatar/AccountAvatar.js'
import { ContextMenu } from '../../components/ContextMenu.js'
import { ListItem } from '../../components/ListItem/ListItem.js'
import { ListItemButton } from '../../components/ListItem/ListItemButton.js'
import { PageContainer } from '../../components/PageContainer.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import type { ToAddress } from '../../types/widget.js'
import { defaultChainIdsByType } from '../../utils/chainType.js'
import { shortenAddress } from '../../utils/wallet.js'

export const SendToConfiguredWalletPage = (): JSX.Element => {
  const { t } = useTranslation()
  const navigateBack = useNavigateBack()
  const { toAddresses } = useWidgetConfig()
  const { requiredToChainType } = useToAddressRequirements()
  const { setSelectedBookmark } = useBookmarkActions()
  const { setFieldValue } = useFieldActions()
  const { getAddressLink } = useExplorer()
  const listParentRef = useRef<HTMLUListElement | null>(null)

  useHeader(t('header.sendToWallet'))

  const { listHeight } = useListHeight({ listParentRef })

  const handleCuratedSelected = (toAddress: ToAddress) => {
    setSelectedBookmark(toAddress)
    setFieldValue('toAddress', toAddress.address, {
      isTouched: true,
      isDirty: true,
    })
    navigateBack()
  }

  return (
    <PageContainer disableGutters>
      <List
        className="long-list"
        ref={listParentRef}
        style={{ height: listHeight, overflow: 'auto' }}
        disablePadding
        sx={{ paddingTop: 1.5 }}
      >
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
            <ContextMenu
              disabled={
                !!(
                  requiredToChainType &&
                  requiredToChainType !== toAddress.chainType
                )
              }
              items={[
                {
                  icon: <ContentCopyRounded />,
                  label: t('button.copyAddress'),
                  onClick: () =>
                    navigator.clipboard.writeText(toAddress.address),
                },
                {
                  icon: <OpenInNewRounded />,
                  label: t('button.viewOnExplorer'),
                  onClick: () =>
                    window.open(
                      getAddressLink(
                        toAddress.address,
                        defaultChainIdsByType[toAddress.chainType]
                      ),
                      '_blank'
                    ),
                },
              ]}
            />
          </ListItem>
        ))}
      </List>
    </PageContainer>
  )
}
