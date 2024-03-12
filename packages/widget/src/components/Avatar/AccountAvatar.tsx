import { getConnectorIcon } from '@lifi/wallet-management';
import { Wallet } from '@mui/icons-material';
import { Badge } from '@mui/material';
import type { Account } from '../../hooks/useAccount.js';
import { useChain } from '../../hooks/useChain.js';
import type { ToAddress } from '../../types/widget.js';
import { SmallAvatar } from '../SmallAvatar.js';
import {
  AvatarDefault,
  AvatarDefaultBadge,
  AvatarMasked,
} from './Avatar.style.js';

interface AccountAvatarProps {
  chainId?: number;
  account?: Account;
  toAddress?: ToAddress;
  empty?: boolean;
}

export const AccountAvatar = ({
  chainId,
  account,
  empty,
  toAddress,
}: AccountAvatarProps) => {
  const { chain } = useChain(chainId);

  const avatar =
    account?.connector || toAddress?.logoURI ? (
      <AvatarMasked
        src={toAddress?.logoURI || getConnectorIcon(account?.connector)}
        alt={toAddress?.name || account?.connector?.name}
        sx={{
          marginRight: chain?.logoURI ? 0 : 1.5,
        }}
      >
        {(toAddress?.name || account?.connector?.name)?.[0]}
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
