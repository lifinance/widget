import type {
  CombinedWallet,
  WalletMenuOpenArgs,
  WalletTagType,
} from '@lifi/wallet-management'
import { CardListItemButton, getConnectorId } from '@lifi/wallet-management'
import { useTranslation } from 'react-i18next'
import {
  MoreWalletsButton,
  MoreWalletsIcon,
  WalletListStack,
  WalletRowsShell,
} from './TopWalletRows.style.js'
import { WalletConnectRow } from './WalletConnectRow.js'

export type TopWalletEntry = CombinedWallet & { tagType?: WalletTagType }

export type TopWalletRowsProps = {
  topWallets: TopWalletEntry[]
  onOpenWalletMenu: (args?: WalletMenuOpenArgs) => void
  onConnected?: () => void
}

export function TopWalletRows({
  topWallets,
  onOpenWalletMenu,
  onConnected,
}: TopWalletRowsProps) {
  const { t } = useTranslation()
  return (
    <WalletRowsShell>
      <WalletListStack>
        {topWallets.map(({ id, name, icon, connectors, tagType }) => {
          if (connectors.length === 1) {
            const { chainType, connector } = connectors[0]
            return (
              <WalletConnectRow
                key={getConnectorId(connector, chainType) ?? name}
                chainType={chainType}
                connector={connector}
                tagType={tagType}
                onConnected={onConnected}
              />
            )
          }
          return (
            <CardListItemButton
              key={name}
              onClick={() => {
                onOpenWalletMenu({ walletId: id ?? name })
              }}
              title={name}
              icon={icon ?? ''}
              tagType={tagType}
            />
          )
        })}
      </WalletListStack>
      <MoreWalletsButton
        fullWidth
        disableElevation
        onClick={() => {
          onOpenWalletMenu()
        }}
        endIcon={<MoreWalletsIcon />}
      >
        {t('checkout.moreWallets')}
      </MoreWalletsButton>
    </WalletRowsShell>
  )
}
