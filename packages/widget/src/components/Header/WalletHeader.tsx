import { getConnectorIcon } from '@lifi/wallet-management';
import { ExpandMore, Wallet } from '@mui/icons-material';
import { Avatar, Badge } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Account } from '../../hooks/useAccount.js';
import { useAccount } from '../../hooks/useAccount.js';
import { useChain } from '../../hooks/useChain.js';
import { useHasExternalWalletProvider } from '../../providers/WalletProvider/useHasExternalWalletProvider.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { HiddenUI } from '../../types/widget.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { shortenAddress } from '../../utils/wallet.js';
import { SmallAvatar } from '../SmallAvatar.js';
import { CloseDrawerButton } from './CloseDrawerButton.js';
import {
  DrawerWalletContainer,
  HeaderAppBar,
  WalletAvatar,
  WalletButton,
} from './Header.style.js';
import { WalletMenu } from './WalletMenu.js';
import { WalletMenuContainer } from './WalletMenu.style.js';

export const WalletHeader: React.FC = () => {
  const { subvariant, hiddenUI } = useWidgetConfig();
  const { hasExternalProvider } = useHasExternalWalletProvider();
  return !hasExternalProvider &&
    subvariant !== 'split' &&
    !hiddenUI?.includes(HiddenUI.WalletMenu) ? (
    <HeaderAppBar elevation={0} sx={{ justifyContent: 'flex-end' }}>
      <WalletMenuButton />
    </HeaderAppBar>
  ) : null;
};

export const SplitWalletMenuButton: React.FC = () => {
  const { hiddenUI } = useWidgetConfig();
  const { hasExternalProvider } = useHasExternalWalletProvider();
  return !hasExternalProvider && !hiddenUI?.includes(HiddenUI.WalletMenu) ? (
    <WalletMenuButton />
  ) : null;
};

export const WalletMenuButton: React.FC = () => {
  const { account } = useAccount();
  const { variant, hiddenUI } = useWidgetConfig();

  if (variant === 'drawer') {
    return (
      <DrawerWalletContainer>
        {account.isConnected ? (
          <ConnectedButton account={account} />
        ) : (
          <ConnectButton />
        )}
        {!hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (
          <CloseDrawerButton header="wallet" />
        ) : null}
      </DrawerWalletContainer>
    );
  }
  return account.isConnected ? (
    <ConnectedButton account={account} />
  ) : (
    <ConnectButton />
  );
};

const ConnectButton = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { walletConfig, subvariant, variant } = useWidgetConfig();
  const navigate = useNavigate();
  const connect = async () => {
    if (walletConfig?.onConnect) {
      walletConfig.onConnect();
      return;
    }
    navigate(navigationRoutes.selectWallet);
  };
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
      onClick={
        !pathname.includes(navigationRoutes.selectWallet) ? connect : undefined
      }
    >
      {t(`button.connectWallet`)}
    </WalletButton>
  );
};

const ConnectedButton = ({ account }: { account: Account }) => {
  const { subvariant } = useWidgetConfig();
  const { chain } = useChain(account.chainId);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const walletAddress = shortenAddress(account.address);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
  );
};
