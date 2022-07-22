import { Token } from '@lifi/sdk';
import { Avatar, Badge, SxProps, Theme } from '@mui/material';
import { useChain } from '../../hooks';
import { SmallAvatar } from '../SmallAvatar';

export const TokenAvatar: React.FC<{
  token: Token;
  sx?: SxProps<Theme>;
}> = ({ token, sx }) => {
  const { chain } = useChain(token.chainId);
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
