import type { ChainType } from '@lifi/sdk'
import type { WidgetProviderContext } from '@lifi/widget-provider'
import type { JSX } from 'react'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { getChainTypeIcon } from '../icons.js'
import { WalletManagementEvent } from '../types/events.js'
import { WalletTagType } from '../types/walletTagType.js'
import { CardListItemButton } from './CardListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

interface EcosystemListItemButtonOptions {
  useEcosystemContext: () => WidgetProviderContext
  chainId: number
  chainType: ChainType
  label: string
}

export const createEcosystemListItemButton = ({
  useEcosystemContext,
  chainId,
  chainType,
  label,
}: EcosystemListItemButtonOptions): React.FC<WalletListItemButtonProps> => {
  return ({
    ecosystemSelection,
    connector,
    tagType,
    onConnected,
    onConnecting,
    onError,
  }: WalletListItemButtonProps): JSX.Element => {
    const emitter = useWalletManagementEvents()
    const { connect, disconnect, isConnected } = useEcosystemContext()
    const { setLastConnectedAccount } = useLastConnectedAccount()

    const connectorDisplayName: string = ecosystemSelection
      ? label
      : connector.name

    const handleConnect = async () => {
      if (tagType === WalletTagType.Connected) {
        onConnected?.()
        return
      }

      try {
        onConnecting?.()
        if (isConnected) {
          await disconnect()
        }
        let didConnect = false
        await connect(connector.id ?? connector.name, (address: string) => {
          didConnect = true
          setLastConnectedAccount(connector)
          emitter.emit(WalletManagementEvent.WalletConnected, {
            address,
            chainId,
            chainType,
            connectorId: connector.id ?? connector.name,
            connectorName: connector.name,
          })
        })
        // Closing the menu without a connection would report success for a wallet
        // that never returned an address.
        if (didConnect) {
          onConnected?.()
        } else {
          onError?.(new Error('Wallet did not return an address.'))
        }
      } catch (error) {
        onError?.(error)
      }
    }

    return (
      <CardListItemButton
        key={connectorDisplayName}
        icon={
          ecosystemSelection
            ? (getChainTypeIcon(chainType) ?? '')
            : (connector.icon ?? '')
        }
        onClick={handleConnect}
        title={connectorDisplayName}
        tagType={
          ecosystemSelection && tagType !== WalletTagType.Connected
            ? undefined
            : tagType
        }
      />
    )
  }
}
