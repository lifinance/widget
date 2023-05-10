import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNewRounded';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewRounded';
import WalletIcon from '@mui/icons-material/Wallet';
import { Avatar, Button, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChain } from '../../hooks';
import { useWallet, useWidgetConfig } from '../../providers';
import { navigationRoutes, shortenAddress } from '../../utils';
import { HeaderAppBar, WalletButton } from './Header.style';
import { WalletMenu } from './WalletMenu';

export const WalletHeader: React.FC = () => {
  return (
    <HeaderAppBar elevation={0} sx={{ justifyContent: 'flex-end' }}>
      <WalletMenuButton />
    </HeaderAppBar>
  );
};

export const WalletMenuButton: React.FC = () => {
  const { account } = useWallet();
  return account.isActive ? <ConnectedButton /> : <ConnectButton />;
};

const ConnectButton = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { walletManagement, subvariant } = useWidgetConfig();
  const { connect: connectWallet } = useWallet();
  const navigate = useNavigate();
  const connect = async () => {
    if (walletManagement) {
      await connectWallet();
      return;
    }
    navigate(navigationRoutes.selectWallet);
  };
  return (
    <WalletButton
      endIcon={subvariant !== 'split' ? <WalletIcon /> : undefined}
      startIcon={subvariant === 'split' ? <WalletIcon /> : undefined}
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

const ConnectedButton = () => {
  const { t } = useTranslation();
  const { subvariant } = useWidgetConfig();
  const { account, disconnect } = useWallet();
  const walletAddress = shortenAddress(account.address);
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
          marginRight: subvariant === 'split' ? 0 : -1.25,
          marginLeft: subvariant === 'split' ? -1 : 0,
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
          <OpenInNewIcon />
          {t(`button.viewOnExplorer`)}
        </MenuItem>
        <Button
          onClick={handleDisconnect}
          fullWidth
          startIcon={<PowerSettingsNewIcon />}
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
