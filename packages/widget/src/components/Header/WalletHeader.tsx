import type { Account } from '@lifi/wallet-management'
import {
  getConnectorIcon,
  useAccount,
  useWalletMenu,
} from '@lifi/wallet-management'
import { ExpandMore, Wallet } from '@mui/icons-material'
import { Avatar, Badge } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
import { useExternalWalletProvider } from '../../providers/WalletProvider/useExternalWalletProvider.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { HiddenUI } from '../../types/widget.js'
import { shortenAddress } from '../../utils/wallet.js'
import { SmallAvatar } from '../Avatar/SmallAvatar.js'
import { CloseDrawerButton } from './CloseDrawerButton.js'
import {
  DrawerWalletContainer,
  HeaderAppBar,
  WalletAvatar,
  WalletButton,
} from './Header.style.js'
import { WalletMenu } from './WalletMenu.js'
import { WalletMenuContainer } from './WalletMenu.style.js'

const useInternalWalletManagement = () => {
  const { subvariant, hiddenUI } = useWidgetConfig()
  const { useExternalWalletProvidersOnly } = useExternalWalletProvider()

  const isSplitVariant = subvariant === 'split'
  const isWalletMenuHidden = hiddenUI?.includes(HiddenUI.WalletMenu)

  const shouldShowWalletMenu =
    !useExternalWalletProvidersOnly && !isSplitVariant && !isWalletMenuHidden

  return shouldShowWalletMenu
}

export const WalletHeader: React.FC = () => {
  const shouldShowWalletMenu = useInternalWalletManagement()

  return shouldShowWalletMenu ? (
    <HeaderAppBar elevation={0} sx={{ justifyContent: 'flex-end' }}>
      <WalletMenuButton />
    </HeaderAppBar>
  ) : null
}

export const SplitWalletMenuButton: React.FC = () => {
  const shouldShowWalletMenu = useInternalWalletManagement()
  return shouldShowWalletMenu ? <WalletMenuButton /> : null
}

export const WalletMenuButton: React.FC = () => {
  const { variant, hiddenUI } = useWidgetConfig()
  const { account, accounts } = useAccount()

  const [fromChainId] = useFieldValues('fromChain')
  const { chain: fromChain } = useChain(fromChainId)

  const activeAccount =
    (fromChain
      ? accounts.find((account) => account.chainType === fromChain.chainType)
      : undefined) || account

  if (variant === 'drawer') {
    return (
      <DrawerWalletContainer>
        {activeAccount.isConnected ? (
          <ConnectedButton account={activeAccount} />
        ) : (
          <ConnectButton />
        )}
        {!hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (
          <CloseDrawerButton header="wallet" />
        ) : null}
      </DrawerWalletContainer>
    )
  }
  return activeAccount.isConnected ? (
    <ConnectedButton account={activeAccount} />
  ) : (
    <ConnectButton />
  )
}

const ConnectButton = () => {
  const { t } = useTranslation()
  const { walletConfig, subvariant, variant } = useWidgetConfig()
  const { openWalletMenu } = useWalletMenu()
  const connect = async () => {
    if (!walletConfig?.usePartialWalletManagement && walletConfig?.onConnect) {
      walletConfig.onConnect()
      return
    }
    openWalletMenu()
  }

  return (
    <WalletButton
      subvariant={subvariant}
      endIcon={
        variant !== 'drawer' && subvariant !== 'split' ? <Wallet /> : undefined
      }
      startIcon={
        variant === 'drawer' || subvariant === 'split' ? (
          <Wallet sx={{ marginLeft: -0.25 }} />
        ) : undefined
      }
      onClick={connect}
    >
      {t('button.connectWallet')}
    </WalletButton>
  )
}

const ConnectedButton = ({ account }: { account: Account }) => {
  const { subvariant } = useWidgetConfig()
  const { chain } = useChain(account.chainId)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const walletAddress = shortenAddress(account.address)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <WalletButton
        subvariant={subvariant}
        endIcon={<ExpandMore />}
        startIcon={
          chain?.logoURI ? (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <SmallAvatar
                  src={chain?.logoURI}
                  alt={chain?.name}
                  sx={{ width: 12, height: 12 }}
                >
                  {chain?.name[0]}
                </SmallAvatar>
              }
            >
              <WalletAvatar
                src={getConnectorIcon(account.connector)}
                alt={account.connector?.name}
              >
                {account.connector?.name[0]}
              </WalletAvatar>
            </Badge>
          ) : (
            <Avatar
              src={getConnectorIcon(account.connector)}
              alt={account.connector?.name}
              sx={{ width: 24, height: 24 }}
            >
              {account.connector?.name[0]}
            </Avatar>
          )
        }
        onClick={handleClick}
      >
        {walletAddress}
      </WalletButton>
      <WalletMenuContainer
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <WalletMenu onClose={handleClose} />
      </WalletMenuContainer>
    </>
  )
}
