import { ChainType } from '@lifi/sdk';
import { getConnectorIcon } from '@lifi/wallet-management';
import {
  ContentCopyRounded,
  OpenInNewRounded,
  PowerSettingsNewRounded,
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount } from '../../hooks/useAccount.js';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { shortenAddress } from '../../utils/wallet.js';
import { AvatarMasked } from '../Avatar/Avatar.style.js';
import { SmallAvatar } from '../SmallAvatar.js';
import { EVMDisconnectIconButton } from './EVMDisconnectIconButton.js';
import { SVMDisconnectIconButton } from './SVMDisconnectIconButton.js';

export const WalletMenu = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { accounts } = useAccount();
  const { getChainById } = useAvailableChains();
  const connect = async () => {
    navigate(navigationRoutes.selectWallet);
    onClose();
  };

  return (
    <Box>
      <Box display="flex" flexDirection="column">
        {accounts.map((account) => {
          const chain = getChainById(account.chainId);
          const walletAddress = shortenAddress(account.address);
          const handleCopyAddress = async () => {
            await navigator.clipboard.writeText(account.address ?? '');
            onClose();
          };

          return (
            <MenuItem key={account.address}>
              <Box flex={1} display="flex" alignItems="center">
                {chain?.logoURI ? (
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <SmallAvatar src={chain?.logoURI} alt={chain?.name}>
                        {chain?.name[0]}
                      </SmallAvatar>
                    }
                    sx={{ marginRight: 1.5 }}
                  >
                    <AvatarMasked
                      src={getConnectorIcon(account.connector)}
                      alt={account.connector?.name}
                      sx={{
                        marginRight: chain?.logoURI ? 0 : 1.5,
                      }}
                    >
                      {account.connector?.name[0]}
                    </AvatarMasked>
                  </Badge>
                ) : (
                  <Avatar
                    src={getConnectorIcon(account.connector)}
                    alt={account.connector?.name}
                    sx={{
                      marginRight: chain?.logoURI ? 0 : 1.5,
                    }}
                  >
                    {account.connector?.name[0]}
                  </Avatar>
                )}
                {walletAddress}
              </Box>
              <Box ml={1}>
                <IconButton size="medium" onClick={handleCopyAddress}>
                  <ContentCopyRounded />
                </IconButton>
                <IconButton
                  size="medium"
                  component="a"
                  onClick={onClose}
                  href={`${chain?.metamask.blockExplorerUrls[0]}address/${account.address}`}
                  target="_blank"
                >
                  <OpenInNewRounded />
                </IconButton>
                {account.chainType === ChainType.EVM ? (
                  <EVMDisconnectIconButton connector={account.connector} />
                ) : account.chainType === ChainType.SVM ? (
                  <SVMDisconnectIconButton />
                ) : null}
              </Box>
            </MenuItem>
          );
        })}
      </Box>
      {!pathname.includes(navigationRoutes.selectWallet) ? (
        <Button
          onClick={connect}
          fullWidth
          startIcon={<PowerSettingsNewRounded />}
          sx={{
            marginTop: 1,
          }}
        >
          {accounts.length > 1
            ? t(`button.changeWallet`)
            : t(`button.connectWallet`)}
        </Button>
      ) : null}
    </Box>
  );
};
