import type { Chain, Token } from '@lifi/sdk';
import type { SxProps, Theme } from '@mui/material';
import { Avatar, Badge } from '@mui/material';
import { useChain, useToken } from '../../hooks';
import { SmallAvatar } from '../SmallAvatar';
import { AvatarSkeleton, AvatarSkeletonContainer } from './TokenAvatar.style';

export const TokenAvatarFallback: React.FC<{
  token: Token;
  sx?: SxProps<Theme>;
}> = ({ token, sx }) => {
  const { chain } = useChain(token.chainId);
  const { token: chainToken } = useToken(token.chainId, token.address);
  return <TokenAvatarBase token={chainToken ?? token} chain={chain} sx={sx} />;
};

export const TokenAvatarBase: React.FC<{
  token: Token;
  chain?: Chain;
  sx?: SxProps<Theme>;
}> = ({ token, chain, sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        chain ? (
          <SmallAvatar src={chain.logoURI} alt={chain.name}>
            {chain.name[0]}
          </SmallAvatar>
        ) : null
      }
      sx={sx}
    >
      <Avatar src={token.logoURI} alt={token.symbol}>
        {token.symbol[0]}
      </Avatar>
    </Badge>
  );
};

export const TokenAvatar: React.FC<{
  token: Token;
  chain?: Chain;
  sx?: SxProps<Theme>;
}> = ({ token, chain, sx }) => {
  if (!chain || !token.logoURI) {
    return <TokenAvatarFallback token={token} sx={sx} />;
  }
  return <TokenAvatarBase token={token} chain={chain} sx={sx} />;
};

export const TokenAvatarSkeleton: React.FC<{
  sx?: SxProps<Theme>;
}> = ({ sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<AvatarSkeleton width={16} height={16} />}
      sx={sx}
    >
      <AvatarSkeletonContainer>
        <AvatarSkeleton width={28} height={28} />
      </AvatarSkeletonContainer>
    </Badge>
  );
};
