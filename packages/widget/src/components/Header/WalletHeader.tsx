import {
  ContentCopy as ContentCopyIcon,
  ExpandMore as ExpandMoreIcon,
  OpenInNewOutlined as OpenInNewOutlinedIcon,
  PowerSettingsNewRounded as PowerSettingsIcon,
  WalletOutlined as WalletOutlinedIcon,
} from '@mui/icons-material';
import { Avatar, Button, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChain } from '../../hooks';
import { useWallet, useWidgetConfig } from '../../providers';
import { navigationRoutes, shortenWalletAddress } from '../../utils';
import { HeaderAppBar, WalletButton } from './Header.style';
import { WalletMenu } from './WalletMenu';

export const WalletHeader: React.FC = () => {
  const { account } = useWallet();
  return (
    <HeaderAppBar elevation={0} sx={{ justifyContent: 'flex-end' }}>
      {account.isActive ? <ConnectedButton /> : <ConnectButton />}
    </HeaderAppBar>
  );
};

const ConnectButton = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const config = useWidgetConfig();
  const { connect: connectWallet } = useWallet();
  const navigate = useNavigate();
  const connect = async () => {
    if (config.walletManagement) {
      await connectWallet();
      return;
    }
    navigate(navigationRoutes.selectWallet);
  };
  return (
    <WalletButton
      endIcon={<WalletOutlinedIcon />}
      onClick={
        !pathname.includes(navigationRoutes.selectWallet) ? connect : undefined
      }
      sx={{
        marginRight: -1.25,
      }}
    >
      {t(`button.connectWallet`)}
    </WalletButton>
  );
};

const ConnectedButton = () => {
  const { t } = useTranslation();
  const { account, disconnect } = useWallet();
  const walletAddress = shortenWalletAddress(account.address);
  const { chain } = useChain(account.chainId);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = () => {
    disconnect();
    handleClose();
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(account.address ?? '');
    handleClose();
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
          marginRight: -1.25,
        }}
        onClick={handleClick}
      >
        {walletAddress}
      </WalletButton>
      <WalletMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleCopyAddress}>
          <ContentCopyIcon />
          {t(`button.copyAddress`)}
        </MenuItem>
        <MenuItem
          component="a"
          onClick={handleClose}
          href={`${chain?.metamask.blockExplorerUrls[0]}address/${account.address}`}
          target="_blank"
        >
          <OpenInNewOutlinedIcon />
          {t(`button.viewOnExplorer`)}
        </MenuItem>
        <Button
          onClick={handleDisconnect}
          fullWidth
          startIcon={<PowerSettingsIcon />}
          sx={{
            marginTop: 1,
          }}
        >
          {t(`button.disconnect`)}
        </Button>
      </WalletMenu>
    </>
  );
};
