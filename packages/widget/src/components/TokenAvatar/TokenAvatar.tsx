import type { Chain, StaticToken } from '@lifi/sdk';
import type { SxProps, Theme } from '@mui/material';
import { Avatar, Badge, Skeleton } from '@mui/material';
import { useChain, useToken } from '../../hooks';
import { SmallAvatar, SmallAvatarSkeleton } from '../SmallAvatar';
import { AvatarDefault, AvatarDefaultBadge } from './TokenAvatar.style';

export const TokenAvatarFallback: React.FC<{
  token?: StaticToken;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, isLoading, sx }) => {
  const { chain } = useChain(token?.chainId);
  const { token: chainToken, isLoading: isLoadingToken } = useToken(
    token?.chainId,
    token?.address,
  );
  return (
    <TokenAvatarBase
      token={chainToken ?? token}
      isLoading={isLoading || isLoadingToken}
      chain={chain}
      sx={sx}
    />
  );
};

export const TokenAvatarBase: React.FC<{
  token?: StaticToken;
  chain?: Chain;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, chain, isLoading, sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        chain && !isLoading ? (
          <SmallAvatar src={chain.logoURI} alt={chain.name}>
            {chain.name[0]}
          </SmallAvatar>
        ) : (
          <SmallAvatarSkeleton />
        )
      }
      sx={sx}
    >
      {isLoading ? (
        <Skeleton width={32} height={32} variant="circular" />
      ) : (
        <Avatar src={token?.logoURI} alt={token?.symbol}>
          {token?.symbol?.[0]}
        </Avatar>
      )}
    </Badge>
  );
};

export const TokenAvatar: React.FC<{
  token?: StaticToken;
  chain?: Chain;
  isLoading?: boolean;
  sx?: SxProps<Theme>;
}> = ({ token, chain, isLoading, sx }) => {
  if (!chain || !token?.logoURI) {
    return <TokenAvatarFallback token={token} isLoading={isLoading} sx={sx} />;
  }
  return (
    <TokenAvatarBase
      token={token}
      chain={chain}
      isLoading={isLoading}
      sx={sx}
    />
  );
};

export const TokenAvatarDefault: React.FC<{
  sx?: SxProps<Theme>;
}> = ({ sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<AvatarDefaultBadge width={16} height={16} />}
      sx={sx}
    >
      <AvatarDefault width={32} height={32} />
    </Badge>
  );
};
