import type { Chain, Token } from '@lifi/sdk';
import type { SxProps, Theme } from '@mui/material';
import { Avatar, Badge } from '@mui/material';
import { useChain, useToken } from '../../hooks';
import { SmallAvatar } from '../SmallAvatar';

export const TokenAvatarFallback: React.FC<{
  token: Token;
  sx?: SxProps<Theme>;
}> = ({ token, sx }) => {
  const { chain } = useChain(token.chainId);
  const { token: chainToken } = useToken(token.chainId, token.address);
  return <TokenAvatar token={chainToken ?? token} chain={chain} sx={sx} />;
};

export const TokenAvatar: React.FC<{
  token: Token;
  chain?: Chain;
  sx?: SxProps<Theme>;
}> = ({ token, chain, sx }) => {
  if (!chain || !token.logoURI) {
    return <TokenAvatarFallback token={token} sx={sx} />;
  }
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
