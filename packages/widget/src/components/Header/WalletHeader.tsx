import { getConnectorIcon } from '@lifi/wallet-management';
import { ExpandMore, Wallet } from '@mui/icons-material';
import { Avatar, Badge } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Account } from '../../hooks';
import { useAccount, useChain } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { useHasExternalWalletProvider } from '../../providers/WalletProvider';
import { HiddenUI } from '../../types';
import { navigationRoutes, shortenAddress } from '../../utils';
import { SmallAvatar } from '../SmallAvatar';
import { CloseDrawerButton } from './CloseDrawerButton';
import {
  DrawerWalletContainer,
  HeaderAppBar,
  WalletButton,
} from './Header.style';
import { WalletMenu } from './WalletMenu';
import { WalletMenuContainer } from './WalletMenu.style';

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
  const { variant, subvariant, hiddenUI } = useWidgetConfig();

  if (variant === 'drawer') {
    return (
      <DrawerWalletContainer>
        {account.isConnected ? (
          <ConnectedButton account={account} />
        ) : (
          <ConnectButton />
        )}
        {subvariant !== 'split' &&
        !hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (
          <CloseDrawerButton />
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
      sx={{
        marginRight: subvariant === 'split' ? 0 : -1.25,
        marginLeft: subvariant === 'split' ? -1.25 : 0,
      }}
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

  const avatar = (
    <Avatar
      src={getConnectorIcon(account.connector)}
      alt={account.connector?.name}
      sx={{ width: 24, height: 24 }}
    >
      {account.connector?.name[0]}
    </Avatar>
  );

  return (
    <>
      <WalletButton
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
                  sx={{ width: 16, height: 16 }}
                >
                  {chain?.name[0]}
                </SmallAvatar>
              }
            >
              {avatar}
            </Badge>
          ) : (
            avatar
          )
        }
        sx={{
          marginRight: subvariant === 'split' ? 0 : -1.25,
          marginLeft: subvariant === 'split' ? -1 : 0,
        }}
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
