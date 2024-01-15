import { Avatar, Badge } from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';
import { getWalletIcon } from '@lifi/wallet-management';
import { Connector } from 'wagmi';
import { useAvailableChains } from '@lifi/widget';
import { Account } from '../hooks';
import { SmallAvatar } from './SmallAvatar';

interface AccountAvatar {
  chainId?: number;
  account?: Account;
}

const WalletAvatar = () => (
  <Avatar>
    <WalletIcon sx={{ fontSize: 20 }} />
  </Avatar>
);

export const AccountAvatar = ({ chainId, account }: AccountAvatar) => {
  const { getChainById } = useAvailableChains();
  const chain = getChainById(chainId);

  const avatar = account ? (
    <Avatar
      src={
        account.connector?.icon ||
        getWalletIcon((account.connector as Connector)?.id)
      }
      alt={account.connector?.name}
      sx={{
        marginRight: chain?.logoURI ? 0 : 1.5,
      }}
    >
      {account.connector?.name[0]}
    </Avatar>
  ) : (
    <WalletAvatar />
  );

  return chainId && chain?.logoURI ? (
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
      {avatar}
    </Badge>
  ) : (
    avatar
  );
};
