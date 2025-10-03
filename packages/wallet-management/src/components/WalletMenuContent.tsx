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
import { useMemo, useReducer, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from '../hooks/useAccount.js'
import type { CombinedWallet } from '../hooks/useCombinedWallets.js'
import { useCombinedWallets } from '../hooks/useCombinedWallets.js'
import type { WalletMenuOpenArgs } from '../providers/WalletMenuProvider/types.js'
import type { WalletConnector } from '../types/walletConnector.js'
import type { WalletTagType } from '../types/walletTagType.js'
import { ElementId } from '../utils/elements.js'
import { getConnectorId } from '../utils/getConnectorId.js'
import { getSortedByTags } from '../utils/getSortedByTags.js'
import { getConnectorTagType, getWalletTagType } from '../utils/walletTags.js'
import { CardListItemButton } from './CardListItemButton.js'
import { EVMListItemButton } from './EVMListItemButton.js'
import { MVMListItemButton } from './MVMListItemButton.js'
import { SVMListItemButton } from './SVMListItemButton.js'
import type { WalletListItemButtonProps } from './types.js'
import { UTXOListItemButton } from './UTXOListItemButton.js'
import { WalletInfoDisplay } from './WalletInfoDisplay.js'
import { WalletMenuContentEmpty } from './WalletMenuContentEmpty.js'

interface WalletMenuContentProps {
  onClose: () => void
  walletChainArgs?: WalletMenuOpenArgs
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
  walletChainArgs,
}) => {
  const { t } = useTranslation()
  const { installedWallets } = useCombinedWallets()
  const selectedWalletRef = useRef<CombinedWallet>(null)

  const { accounts } = useAccount()
  const connectedConnectorIds: string[] = useMemo(() => {
    return accounts
      .filter((account) => account.isConnected)
      .map((account) => getConnectorId(account.connector, account.chainType))
      .filter(Boolean)
  }, [accounts])

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

  const walletChainLabel = useMemo(() => {
    if (!walletChainArgs) {
      return undefined
    }
    if (walletChainArgs.chain) {
      return walletChainArgs.chain.name
    }
    return walletChainArgs.chainType
  }, [walletChainArgs])

  const filteredWallets = useMemo(() => {
    if (!walletChainArgs) {
      return installedWallets
    }

    const targetChainType =
      walletChainArgs.chain?.chainType ?? walletChainArgs.chainType

    return installedWallets
      .map((wallet) => {
        const filteredConnectors = wallet.connectors.filter(
          (c) => c.chainType === targetChainType
        )
        return filteredConnectors.length
          ? { ...wallet, connectors: filteredConnectors }
          : null
      })
      .filter(Boolean) as typeof installedWallets
  }, [installedWallets, walletChainArgs])

  const isMultiEcosystem = state.view === 'multi-ecosystem'
  const isConnecting = state.view === 'connecting'

  // We need to preserve selectedWallet between re-renders to avoid empty state once wallet is connected
  let selectedWallet = state.selectedWalletId
    ? filteredWallets.find((wallet) => wallet.id === state.selectedWalletId)
    : null
  selectedWalletRef.current = selectedWallet || selectedWalletRef.current
  selectedWallet = selectedWalletRef.current

  const filteredWalletsWithTagTypes = useMemo(
    () =>
      getSortedByTags(
        filteredWallets
          .filter((wallet) => wallet.connectors?.length)
          .map((wallet) => {
            return {
              ...wallet,
              tagType: getWalletTagType(wallet, connectedConnectorIds),
            }
          })
      ),
    [filteredWallets, connectedConnectorIds]
  )

  const getWalletButton = (
    id: string,
    name: string,
    chainType: ChainType,
    connector: WalletConnector,
    ecosystemSelection?: boolean,
    tagType?: WalletTagType
  ) => {
    const key = `${name}${ecosystemSelection ? `-${chainType}` : ''}`

    let ListItemButtonComponent: React.FC<WalletListItemButtonProps> | null =
      null
    switch (chainType) {
      case ChainType.EVM:
        ListItemButtonComponent = EVMListItemButton
        break
      case ChainType.UTXO:
        ListItemButtonComponent = UTXOListItemButton
        break
      case ChainType.SVM:
        ListItemButtonComponent = SVMListItemButton
        break
      case ChainType.MVM:
        ListItemButtonComponent = MVMListItemButton
        break
    }

    return ListItemButtonComponent ? (
      <ListItemButtonComponent
        key={key}
        ecosystemSelection={ecosystemSelection}
        tagType={tagType}
        connector={connector}
        onConnected={onClose}
        onConnecting={() => handleConnecting(id)}
        onError={(error) => handleError(id, error)}
      />
    ) : null
  }

  const selectedWalletConnectors = useMemo(() => {
    return getSortedByTags(
      selectedWallet?.connectors?.map((connector) => {
        const connectorId = getConnectorId(
          connector.connector,
          connector.chainType
        )
        return {
          ...connector,
          tagType: connectorId
            ? getConnectorTagType(
                connectorId,
                connectedConnectorIds.includes(connectorId)
              )
            : undefined,
        }
      }) || []
    )
  }, [selectedWallet, connectedConnectorIds])

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
              : walletChainLabel
                ? t('title.selectWalletWithChain', {
                    chainLabel: walletChainLabel,
                  })
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
              component="div"
              sx={{
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {filteredWalletsWithTagTypes.length ? (
                filteredWalletsWithTagTypes.map(
                  ({ id, name, icon, connectors, tagType }) => {
                    if (connectors.length === 1) {
                      const { chainType, connector } = connectors[0]
                      return getWalletButton(
                        getConnectorId(connector, chainType),
                        name,
                        chainType,
                        connector,
                        false,
                        tagType
                      )
                    }
                    return (
                      <CardListItemButton
                        key={name}
                        onClick={() => handleMultiEcosystem(id)}
                        title={name}
                        icon={icon ?? ''}
                        tagType={tagType}
                      />
                    )
                  }
                )
              ) : (
                <WalletMenuContentEmpty />
              )}
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
                {selectedWalletConnectors.map(
                  ({ chainType, tagType, connector }) =>
                    getWalletButton(
                      state.selectedWalletId!,
                      selectedWallet?.name || '',
                      chainType,
                      connector,
                      true,
                      tagType
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
            <div>
              <WalletInfoDisplay
                selectedWallet={selectedWallet}
                title={t('title.waitingForWallet', {
                  walletName: selectedWallet?.name,
                })}
                message={t('message.connecting')}
              />
            </div>
          </Fade>
        </Collapse>
      </DialogContent>
    </>
  )
}
