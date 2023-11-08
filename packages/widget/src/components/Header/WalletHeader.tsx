import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WalletIcon from '@mui/icons-material/Wallet';
import { Avatar } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Account } from '../../hooks';
import { useAccount, useChain } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { navigationRoutes, shortenAddress } from '../../utils';
import {
  DrawerWalletContainer,
  HeaderAppBar,
  WalletButton,
} from './Header.style';
import { WalletMenu } from './WalletMenu';
import { WalletMenuContainer } from './WalletMenu.style';

export const WalletHeader: React.FC = () => {
  return (
    <HeaderAppBar elevation={0} sx={{ justifyContent: 'flex-end' }}>
      <WalletMenuButton />
    </HeaderAppBar>
  );
};

export const WalletMenuButton: React.FC = () => {
  const { account } = useAccount();
  const { variant } = useWidgetConfig();

  if (variant === 'drawer') {
    return (
      <DrawerWalletContainer>
        {account.isConnected ? (
          <ConnectedButton account={account} />
        ) : (
          <ConnectButton />
        )}
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
  const { walletManagement, subvariant, variant } = useWidgetConfig();
  const navigate = useNavigate();
  const connect = async () => {
    if (walletManagement) {
      await walletManagement.connect();
      return;
    }
    navigate(navigationRoutes.selectWallet);
  };
  return (
    <WalletButton
      endIcon={
        variant !== 'drawer' && subvariant !== 'split' ? (
          <WalletIcon />
        ) : undefined
      }
      startIcon={
        variant === 'drawer' || subvariant === 'split' ? (
          <WalletIcon sx={{ marginLeft: -0.25 }} />
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

  return (
    <>
      <WalletButton
        endIcon={<ExpandMoreIcon />}
        startIcon={
          <Avatar
            src={chain?.logoURI}
            alt={chain?.key}
            sx={{ width: 24, height: 24 }}
          >
            {chain?.name[0]}
          </Avatar>
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
