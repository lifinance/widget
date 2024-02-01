import { getConnectorIcon } from '@lifi/wallet-management';
import WalletIcon from '@mui/icons-material/Wallet';
import { Avatar, Badge } from '@mui/material';
import type { Account } from '../hooks';
import { useChain } from '../hooks';
import { SmallAvatar } from './SmallAvatar';

interface AccountAvatarProps {
  chainId?: number;
  account?: Account;
}

const WalletAvatar = () => (
  <Avatar>
    <WalletIcon sx={{ fontSize: 20 }} />
  </Avatar>
);

export const AccountAvatar = ({ chainId, account }: AccountAvatarProps) => {
  const { chain } = useChain(chainId);

  const avatar = account ? (
    <Avatar
      src={getConnectorIcon(account.connector)}
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
    >
      {avatar}
    </Badge>
  ) : (
    avatar
  );
};
