import { useWalletInterface } from '@lifinance/widget/services/walletInterface';
import { Box, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  usePriorityAccount,
  usePriorityConnector,
} from '../../hooks/connectorHooks';
import { Header } from '../Header';
import { WalletTypography } from './WalletHeader.style';

export const WalletHeader: React.FC = () => {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchor);
  const connector = usePriorityConnector();
  const account = usePriorityAccount();
  const walletAddress = account
    ? `${account.substring(0, 7)}...${account.substring(account.length - 7)}`
    : null;
  const { disconnect } = useWalletInterface();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleDisconnect = () => {
    disconnect();
    handleClose();
  };

  return (
    <Header height={40}>
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
        <WalletTypography
          variant="body2"
          noWrap
          align="right"
          color="grey.500"
          mt={2}
          id="wallet"
          aria-controls={open ? 'wallet-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          connected={Boolean(walletAddress)}
        >
          {walletAddress
            ? t(`header.walletConnected`, { walletAddress })
            : t(`header.walletNotConnected`)}
        </WalletTypography>
      </Box>
      <Menu
        id="wallet-menu"
        anchorEl={menuAnchor}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'wallet-menu',
        }}
        anchorReference="anchorEl"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MenuItem dense onClick={handleDisconnect}>
          {t(`header.disconnect`)}
        </MenuItem>
      </Menu>
    </Header>
  );
};
