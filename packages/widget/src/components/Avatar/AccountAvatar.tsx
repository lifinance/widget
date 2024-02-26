import { getConnectorIcon } from '@lifi/wallet-management';
import { Wallet } from '@mui/icons-material';
import { Badge } from '@mui/material';
import type { Account } from '../../hooks/useAccount.js';
import { useChain } from '../../hooks/useChain.js';
import { SmallAvatar } from '../SmallAvatar.js';
import {
  AvatarDefault,
  AvatarDefaultBadge,
  AvatarMasked,
} from './Avatar.style.js';

interface AccountAvatarProps {
  chainId?: number;
  account?: Account;
  empty?: boolean;
}

export const AccountAvatar = ({
  chainId,
  account,
  empty,
}: AccountAvatarProps) => {
  const { chain } = useChain(chainId);

  const avatar = account ? (
    <AvatarMasked
      src={getConnectorIcon(account.connector)}
      alt={account.connector?.name}
      sx={{
        marginRight: chain?.logoURI ? 0 : 1.5,
      }}
    >
      {account.connector?.name[0]}
    </AvatarMasked>
  ) : empty ? (
    <AvatarDefault />
  ) : (
    <AvatarDefault>
      <Wallet sx={{ fontSize: 20 }} />
    </AvatarDefault>
  );

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        chain ? (
          <SmallAvatar src={chain.logoURI} alt={chain.name}>
            {chain.name[0]}
          </SmallAvatar>
        ) : (
          <AvatarDefaultBadge />
        )
      }
    >
      {avatar}
    </Badge>
  );
};
