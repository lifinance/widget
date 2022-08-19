import type { Token } from '@lifi/sdk';
import type { SxProps, Theme } from '@mui/material';
import { Avatar, Badge } from '@mui/material';
import { useChain, useToken } from '../../hooks';
import { SmallAvatar } from '../SmallAvatar';

export const TokenAvatar: React.FC<{
  token: Token;
  sx?: SxProps<Theme>;
}> = ({ token, sx }) => {
  const { chain } = useChain(token.chainId);
  const { token: chainToken } = useToken(token.chainId, token.address);
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
      <Avatar src={token.logoURI || chainToken?.logoURI} alt={token.symbol}>
        {token.symbol[0]}
      </Avatar>
    </Badge>
  );
};
