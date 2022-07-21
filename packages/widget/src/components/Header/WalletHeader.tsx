import {
  AccountBalanceWalletOutlined as AccountBalanceWalletIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../../providers/WalletProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider';
import { navigationRoutes } from '../../utils';
import { HeaderAppBar } from './Header.style';

export const WalletHeader: React.FC = () => {
  const { t } = useTranslation();
  const { account, disconnect } = useWallet();
  const walletAddress = account.address
    ? `${account.address.substring(0, 7)}...${account.address.substring(
        account.address.length - 7,
      )}`
    : null;

  return (
    <HeaderAppBar elevation={0}>
      {walletAddress ? (
        <>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
            }}
            mr={0.5}
          >
            <Typography variant="caption" align="right">
              {t(`header.walletConnected`)}
            </Typography>
            <Typography variant="body2" align="right" fontWeight="600">
              {walletAddress}
            </Typography>
          </Box>
          <IconButton
            size="medium"
            aria-label="disconnect"
            edge="end"
            onClick={disconnect}
          >
            <LogoutIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography
            variant="body2"
            align="right"
            fontWeight="600"
            flex={1}
            mr={0.5}
          >
            {t(`header.connectWallet`)}
          </Typography>
          <ConnectButton />
        </>
      )}
    </HeaderAppBar>
  );
};

const ConnectButton = () => {
  const { pathname } = useLocation();
  const config = useWidgetConfig();
  const { connect: walletConnect } = useWallet();
  const navigate = useNavigate();
  const connect = async () => {
    if (config.walletManagement) {
      await walletConnect();
      return;
    }
    navigate(navigationRoutes.selectWallet);
  };
  return (
    <IconButton
      size="medium"
      aria-label="disconnect"
      edge="end"
      onClick={
        !pathname.includes(navigationRoutes.selectWallet) ? connect : undefined
      }
    >
      <AccountBalanceWalletIcon />
    </IconButton>
  );
};
