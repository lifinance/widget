import { getWalletIcon } from '@lifi/wallet-management';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WalletIcon from '@mui/icons-material/Wallet';
import { Avatar, Badge } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Connector } from 'wagmi';
import type { Account } from '../../hooks';
import { useAccount, useChain } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { navigationRoutes, shortenAddress } from '../../utils';
import { SmallAvatar } from '../SmallAvatar';
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

  const avatar = (
    <Avatar
      src={
        account.connector?.icon ||
        getWalletIcon((account.connector as Connector)?.id)
      }
      alt={account.connector?.name}
      sx={{ width: 24, height: 24 }}
    >
      {account.connector?.name[0]}
    </Avatar>
  );

  return (
    <>
      <WalletButton
        endIcon={<ExpandMoreIcon />}
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
