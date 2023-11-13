import { ChainType } from '@lifi/sdk';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNewRounded';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNewRounded';
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  MenuItem,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Connector } from 'wagmi';
import { useDisconnect } from 'wagmi';
import { useAccount, useAvailableChains } from '../../hooks';
import { navigationRoutes, shortenAddress } from '../../utils';
import { SmallAvatar } from '../SmallAvatar';

export const WalletMenu = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { accounts } = useAccount();
  const { getChainById } = useAvailableChains();
  const connect = async () => {
    navigate(navigationRoutes.selectWallet);
    onClose();
  };

  return (
    <Box>
      <Box display="flex" flexDirection="column">
        {accounts
          .filter((account) => account.isConnected)
          .map((account) => {
            const chain = getChainById(account.chainId);
            const walletAddress = shortenAddress(account.address);
            const handleCopyAddress = async () => {
              await navigator.clipboard.writeText(account.address ?? '');
              onClose();
            };
            return (
              <MenuItem key={account.address}>
                <Box flex={1}>
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
                    <Avatar
                      src={account.connector?.icon}
                      alt={account.connector?.name}
                      sx={{ width: 32, height: 32 }}
                    >
                      {account.connector?.name[0]}
                    </Avatar>
                  </Badge>
                  {walletAddress}
                </Box>
                <Box ml={1}>
                  <IconButton size="medium" onClick={handleCopyAddress}>
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton
                    size="medium"
                    component="a"
                    onClick={onClose}
                    href={`${chain?.metamask.blockExplorerUrls[0]}address/${account.address}`}
                    target="_blank"
                  >
                    <OpenInNewIcon />
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
      <Button
        onClick={connect}
        fullWidth
        startIcon={<PowerSettingsNewIcon />}
        sx={{
          marginTop: 1,
        }}
      >
        {t(`button.connectWallet`)}
      </Button>
    </Box>
  );
};

const EVMDisconnectIconButton = ({ connector }: { connector?: Connector }) => {
  const { disconnect } = useDisconnect();

  return (
    <IconButton
      size="medium"
      onClick={(e) => {
        e.stopPropagation();
        disconnect({ connector });
      }}
    >
      <PowerSettingsNewIcon />
    </IconButton>
  );
};

const SVMDisconnectIconButton = () => {
  const { disconnect } = useWallet();

  return (
    <IconButton
      size="medium"
      onClick={(e) => {
        e.stopPropagation();
        disconnect();
      }}
    >
      <PowerSettingsNewIcon />
    </IconButton>
  );
};
