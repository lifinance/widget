import {
  Avatar,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { memo } from 'react';
import { TokenListItem, TokenListItemButton } from './TokenList.style';
import { TokenListItemBaseProps, TokenListItemProps } from './types';

export const MemoizedTokenListItem: React.FC<TokenListItemProps> = memo(
  ({ onClick, size, start, token, isBalancesLoading }) => {
    const handleClick = () => onClick?.(token.symbol);
    return (
      <TokenListItem
        secondaryAction={
          isBalancesLoading ? (
            <Skeleton variant="text" width={50} height={24} />
          ) : (
            <Typography variant="body1" noWrap>
              {token.amount}
            </Typography>
          )
        }
        disablePadding
        style={{
          height: `${size}px`,
          transform: `translateY(${start}px)`,
        }}
      >
        <TokenListItemButton dense onClick={handleClick}>
          <ListItemAvatar>
            <Avatar src={token.logoURI} alt={token.symbol}>
              {token.symbol[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={token.symbol} secondary={token.name} />
        </TokenListItemButton>
      </TokenListItem>
    );
  },
);

export const MemoizedTokenListItemSkeleton: React.FC<
  TokenListItemBaseProps
> = ({ size, start }) => {
  return (
    <TokenListItem
      secondaryAction={<Skeleton variant="text" width={60} height={24} />}
      disablePadding
      style={{
        height: `${size}px`,
        transform: `translateY(${start}px)`,
      }}
    >
      <ListItemAvatar>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{ marginLeft: '12px', marginRight: '16px' }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width={32} height={20} />}
        secondary={<Skeleton variant="text" width={128} height={20} />}
      />
    </TokenListItem>
  );
};
