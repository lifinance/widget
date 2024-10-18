import { ChainType } from '@lifi/sdk'
import { ArrowBack, Close } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Collapse,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  List,
  ListItemAvatar,
  Typography,
} from '@mui/material'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import { useReducer, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { Connector } from 'wagmi'
import type { CombinedWallet } from '../hooks/useCombinedWallets.js'
import { useCombinedWallets } from '../hooks/useCombinedWallets.js'
import type { WalletConnector } from '../types/walletConnector.js'
import { EVMListItemButton } from './EVMListItemButton.js'
import { ListItemButton } from './ListItemButton.js'
import { ListItemText } from './ListItemText.js'
import { SVMListItemButton } from './SVMListItemButton.js'
import { UTXOListItemButton } from './UTXOListItemButton.js'

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
  const selectedWalletRef = useRef<CombinedWallet>()

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
            connector={connector as Connector}
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
          <Box height={40} width={40} />
        )}
        <Typography fontWeight={700} margin="auto">
          {isMultiEcosystem
            ? t('title.selectEcosystem')
            : isConnecting
              ? t('title.connecting')
              : t('title.connectWallet')}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <Collapse
          in={state.view === 'wallet-list'}
          timeout={{ appear: 225, enter: 225, exit: 225 }}
        >
          <Fade
            in={state.view === 'wallet-list'}
            timeout={{ appear: 225, enter: 100, exit: 225 }}
          >
            <List sx={{ padding: 0 }}>
              {installedWallets.map(({ id, name, icon, connectors }) => {
                if (connectors.length === 1) {
                  const { chainType, connector } = connectors[0]
                  return getWalletButton(id, name, chainType, connector)
                }
                return (
                  <ListItemButton
                    key={name}
                    onClick={() => handleMultiEcosystem(id)}
                  >
                    <ListItemAvatar>
                      <Avatar src={icon} alt={name}>
                        {name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={name} />
                  </ListItemButton>
                )
              })}
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
            <List sx={{ padding: 0 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                px={1}
                pb={2}
              >
                <Avatar
                  src={selectedWallet?.icon}
                  alt={selectedWallet?.name}
                  sx={{ width: 80, height: 80 }}
                >
                  {selectedWallet?.name[0]}
                </Avatar>
                <Typography pt={2} textAlign="center" variant="body2">
                  {t('message.multipleEcosystems', {
                    walletName: selectedWallet?.name,
                  })}
                </Typography>
              </Box>
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
            <List sx={{ padding: 0 }}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                px={1}
                pb={2}
              >
                <Avatar
                  src={selectedWallet?.icon}
                  alt={selectedWallet?.name}
                  sx={{ width: 80, height: 80 }}
                >
                  {selectedWallet?.name[0]}
                </Avatar>
                <Typography pt={2} textAlign="center" fontWeight={500}>
                  {t('title.waitingForWallet', {
                    walletName: selectedWallet?.name,
                  })}
                </Typography>
                <Typography pt={2} textAlign="center" variant="body2">
                  {t('message.connecting')}
                </Typography>
              </Box>
            </List>
          </Fade>
        </Collapse>
      </DialogContent>
    </>
  )
}
