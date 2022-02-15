import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  usePriorityAccount,
  usePriorityConnector,
} from '../hooks/connectorHooks';
import { Header } from './Header';

export const WalletTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'connected',
})<{ connected?: boolean }>(({ theme, connected }) => ({
  transition: theme.transitions.create(['color']),
  pointerEvents: connected ? 'auto' : 'none',
  '&:hover': {
    color: theme.palette.grey[200],
    cursor: 'pointer',
  },
}));

export const WalletHeader: React.FC = () => {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchor);
  const connector = usePriorityConnector();
  const account = usePriorityAccount();
  const walletAddress = account
    ? `${account.substring(0, 7)}...${account.substring(account.length - 7)}`
    : null;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleDisconnect = () => {
    connector.deactivate();
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
