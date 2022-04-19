import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../../providers/WalletProvider';
import { routes } from '../../utils/routes';
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
    <HeaderAppBar elevation={0} pt={1.5}>
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
            <Typography variant="caption" align="right" color="black">
              {t(`header.walletConnected`)}
            </Typography>
            <Typography
              variant="body2"
              align="right"
              color="black"
              fontWeight="bold"
            >
              {walletAddress}
            </Typography>
          </Box>
          <IconButton
            size="large"
            aria-label="disconnect"
            color="inherit"
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
            color="black"
            fontWeight="bold"
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
  const navigate = useNavigate();
  const connect = () => {
    navigate(routes.selectWallet);
  };
  return (
    <IconButton
      size="large"
      aria-label="disconnect"
      color="inherit"
      edge="end"
      onClick={pathname !== routes.selectWallet ? connect : undefined}
    >
      <AccountBalanceWalletIcon />
    </IconButton>
  );
};
