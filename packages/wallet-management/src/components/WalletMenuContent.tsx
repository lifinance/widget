import type { Connector as BigmiConnector } from '@bigmi/client'
import { ChainType } from '@lifi/sdk'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Close from '@mui/icons-material/Close'
import {
  Box,
  Collapse,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  List,
  Typography,
} from '@mui/material'
import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import { useReducer, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { Connector } from 'wagmi'
import type { CombinedWallet } from '../hooks/useCombinedWallets.js'
import { useCombinedWallets } from '../hooks/useCombinedWallets.js'
import type { WalletConnector } from '../types/walletConnector.js'
import { ElementId } from '../utils/elements.js'
import { WalletTagType, getTagType } from '../utils/walletTags.js'
import { CardListItemButton } from './CardListItemButton.js'
import { EVMListItemButton } from './EVMListItemButton.js'
import { SVMListItemButton } from './SVMListItemButton.js'
import { SuiListItemButton } from './SuiListItemButton.js'
import { UTXOListItemButton } from './UTXOListItemButton.js'
import { WalletInfoDisplay } from './WalletInfoDisplay.js'
import { WalletMenuContentEmpty } from './WalletMenuContentEmpty.js'

interface WalletMenuContentProps {
  onClose: () => void
}

interface State {
  view: 'wallet-list' | 'multi-ecosystem' | 'connecting'
  selectedWalletId?: string
}

type Action =
  | { type: 'SHOW_WALLET_LIST' }
  | { type: 'SHOW_MULTI_ECOSYSTEM'; id: string }
  | { type: 'SHOW_CONNECTING'; id: string }
  | { type: 'HANDLE_ERROR'; id: string; error: any }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SHOW_WALLET_LIST':
      return { ...state, view: 'wallet-list' }
    case 'SHOW_MULTI_ECOSYSTEM':
      return { view: 'multi-ecosystem', selectedWalletId: action.id }
    case 'SHOW_CONNECTING':
      return { view: 'connecting', selectedWalletId: action.id }
    case 'HANDLE_ERROR':
      if (action.error?.message?.includes('pending')) {
        return { view: 'connecting', selectedWalletId: action.id }
      }
      return { view: 'wallet-list', selectedWalletId: action.id }
    default:
      return state
  }
}

export const WalletMenuContent: React.FC<WalletMenuContentProps> = ({
  onClose,
}) => {
  const { t } = useTranslation()
  const { installedWallets } = useCombinedWallets()
  const selectedWalletRef = useRef<CombinedWallet>(null)

  const [state, dispatch] = useReducer(reducer, { view: 'wallet-list' })

  const handleMultiEcosystem = (id: string) => {
    dispatch({ type: 'SHOW_MULTI_ECOSYSTEM', id })
  }

  const handleConnecting = (id: string) => {
    dispatch({ type: 'SHOW_CONNECTING', id })
  }

  const handleBack = () => {
    dispatch({ type: 'SHOW_WALLET_LIST' })
  }

  const handleError = (id: string, error: any) => {
    dispatch({ type: 'HANDLE_ERROR', id, error })
  }

  const isMultiEcosystem = state.view === 'multi-ecosystem'
  const isConnecting = state.view === 'connecting'

  // We need to preserve selectedWallet between re-renders to avoid empty state once wallet is connected
  let selectedWallet = state.selectedWalletId
    ? installedWallets.find((wallet) => wallet.id === state.selectedWalletId)
    : null
  selectedWalletRef.current = selectedWallet || selectedWalletRef.current
  selectedWallet = selectedWalletRef.current

  const installedWalletsWithTagTypes = installedWallets
    .filter((wallet) => wallet.connectors?.length)
    .map((wallet) => {
      const connector = wallet.connectors[0].connector
      const connectorKey =
        'id' in connector && connector.id ? connector.id : connector.name
      return {
        ...wallet,
        tagType:
          wallet.connectors.length > 1
            ? WalletTagType.Multichain
            : getTagType(connectorKey),
      }
    })
    .sort((a, b) => {
      const tagOrder = {
        [WalletTagType.Multichain]: 0,
        [WalletTagType.Installed]: 1,
        [WalletTagType.QrCode]: 2,
        [WalletTagType.GetStarted]: 3,
      }
      return tagOrder[a.tagType] - tagOrder[b.tagType]
    })

  const getWalletButton = (
    id: string,
    name: string,
    chainType: ChainType,
    connector: WalletConnector,
    ecosystemSelection?: boolean
  ) => {
    const key = `${name}${ecosystemSelection ? `-${chainType}` : ''}`

    switch (chainType) {
      case ChainType.UTXO:
        return (
          <UTXOListItemButton
            key={key}
            ecosystemSelection={ecosystemSelection}
            connector={connector as BigmiConnector}
            onConnected={onClose}
            onConnecting={() => handleConnecting(id)}
            onError={(error) => handleError(id, error)}
          />
        )
      case ChainType.EVM:
        return (
          <EVMListItemButton
            key={key}
            ecosystemSelection={ecosystemSelection}
            connector={connector as Connector}
            onConnected={onClose}
            onConnecting={() => handleConnecting(id)}
            onError={(error) => handleError(id, error)}
          />
        )
      case ChainType.SVM:
        return (
          <SVMListItemButton
            key={key}
            ecosystemSelection={ecosystemSelection}
            walletAdapter={connector as WalletAdapter}
            onConnected={onClose}
            onConnecting={() => handleConnecting(id)}
            onError={(error) => handleError(id, error)}
          />
        )
      case ChainType.MVM:
        return (
          <SuiListItemButton
            key={key}
            ecosystemSelection={ecosystemSelection}
            wallet={connector as WalletWithRequiredFeatures}
            onConnected={onClose}
            onConnecting={() => handleConnecting(id)}
            onError={(error) => handleError(id, error)}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
        }}
      >
        {isMultiEcosystem || isConnecting ? (
          <IconButton onClick={handleBack}>
            <ArrowBack />
          </IconButton>
        ) : (
          <Box
            sx={{
              height: 40,
              width: 40,
            }}
          />
        )}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '18px',
            margin: 'auto',
          }}
        >
          {isMultiEcosystem
            ? t('title.selectEcosystem')
            : isConnecting
              ? t('title.connecting')
              : t('title.selectWallet')}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }} id={ElementId.WalletModalContent}>
        <Collapse
          in={state.view === 'wallet-list'}
          timeout={{ appear: 225, enter: 225, exit: 225 }}
        >
          <Fade
            in={state.view === 'wallet-list'}
            timeout={{ appear: 225, enter: 100, exit: 225 }}
          >
            <List
              sx={{
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {installedWalletsWithTagTypes.map(
                ({ id, name, icon, connectors }) => {
                  if (connectors.length === 1) {
                    const { chainType, connector } = connectors[0]
                    return getWalletButton(id, name, chainType, connector)
                  }
                  return (
                    <CardListItemButton
                      key={name}
                      onClick={() => handleMultiEcosystem(id)}
                      title={name}
                      icon={icon ?? ''}
                      tagType={WalletTagType.Multichain}
                    />
                  )
                }
              )}
              {/* TODO: show all connected wallets with 'Connected' badge
            and have this empty screen only when there is no installed wallets at all */}
              {!installedWalletsWithTagTypes.length ? (
                <WalletMenuContentEmpty />
              ) : null}
            </List>
          </Fade>
        </Collapse>
        {/* Multi Ecosystem View */}
        <Collapse
          in={state.view === 'multi-ecosystem'}
          timeout={{ appear: 225, enter: 225, exit: 225 }}
        >
          <Fade
            in={state.view === 'multi-ecosystem'}
            timeout={{ appear: 225, enter: 225, exit: 100 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <WalletInfoDisplay
                selectedWallet={selectedWallet}
                message={t('message.multipleEcosystems', {
                  walletName: selectedWallet?.name,
                })}
              />
              <List
                sx={{
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {selectedWallet?.connectors.map(({ chainType, connector }) =>
                  getWalletButton(
                    state.selectedWalletId!,
                    selectedWallet?.name,
                    chainType,
                    connector,
                    true
                  )
                )}
              </List>
            </Box>
          </Fade>
        </Collapse>
        {/* Connecting View */}
        <Collapse
          in={state.view === 'connecting'}
          timeout={{ appear: 225, enter: 225, exit: 225 }}
        >
          <Fade
            in={state.view === 'connecting'}
            timeout={{ appear: 225, enter: 225, exit: 100 }}
          >
            <WalletInfoDisplay
              selectedWallet={selectedWallet}
              title={t('title.waitingForWallet', {
                walletName: selectedWallet?.name,
              })}
              message={t('message.connecting')}
            />
          </Fade>
        </Collapse>
      </DialogContent>
    </>
  )
}
