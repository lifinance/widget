import { ChainType } from '@lifi/sdk'
import { isWalletInstalled, useEVMContext } from '@lifi/wallet-provider'
import { useLastConnectedAccount } from '../hooks/useAccount.js'
import { useWalletManagementEvents } from '../hooks/useWalletManagementEvents.js'
import { getChainTypeIcon } from '../icons.js'
import { WalletManagementEvent } from '../types/events.js'
import { WalletTagType } from '../types/walletTagType.js'
import { createWalletConnectElement } from '../utils/elements.js'
import { getConnectorIcon } from '../utils/getConnectorIcon.js'
import { CardListItemButton } from './CardListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'

interface EVMListItemButtonProps extends WalletListItemButtonProps {
  connector: any
}

export const EVMListItemButton = ({
  ecosystemSelection,
  connector,
  tagType,
  onNotInstalled,
  onConnected,
  onConnecting,
  onError,
}: EVMListItemButtonProps) => {
  const emitter = useWalletManagementEvents()
  const { connect, disconnect } = useEVMContext()
  const { setLastConnectedAccount } = useLastConnectedAccount()

  const connectorName = connector.displayName || connector.name
  const connectorDisplayName: string = ecosystemSelection
    ? 'Ethereum'
    : connectorName

  const handleEVMConnect = async () => {
    if (tagType === WalletTagType.Connected) {
      onConnected?.()
      return
    }

    try {
      const identityCheckPassed = isWalletInstalled(connector.id)
      if (!identityCheckPassed) {
        onNotInstalled?.(connector)
        return
      }
      if (connector.id === 'walletConnect') {
        createWalletConnectElement()
      }
      onConnecting?.()
      // Disconnect currently connected EVM wallet (if any)
      await disconnect()
      const data = await connect(connector)
      setLastConnectedAccount(connector)
      emitter.emit(WalletManagementEvent.WalletConnected, {
        address: data.accounts[0],
        chainId: data.chainId,
        chainType: ChainType.EVM,
        connectorId: connector.id,
        connectorName: connectorName,
      })
      onConnected?.()
    } catch (error) {
      onError?.(error)
    }
  }

  return (
    <CardListItemButton
      key={connector.id}
      icon={
        ecosystemSelection
          ? getChainTypeIcon(ChainType.EVM)
          : (getConnectorIcon(connector) ?? '')
      }
      onClick={handleEVMConnect}
      title={connectorDisplayName}
      tagType={
        ecosystemSelection && tagType !== WalletTagType.Connected
          ? undefined
          : tagType
      }
    />
  )
}
