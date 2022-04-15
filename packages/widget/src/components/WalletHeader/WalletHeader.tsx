import { Box, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../../providers/WalletProvider';
import { Header } from '../Header';
import { WalletTypography } from './WalletHeader.style';

export const WalletHeader: React.FC = () => {
  const { t } = useTranslation();
  const { account, disconnect } = useWallet();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchor);
  const walletAddress = account.address
    ? `${account.address.substring(0, 7)}...${account.address.substring(
        account.address.length - 7,
      )}`
    : null;
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
          color="black"
          pt={2}
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
        elevation={2}
        MenuListProps={{
          'aria-labelledby': 'wallet-menu',
          dense: true,
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
