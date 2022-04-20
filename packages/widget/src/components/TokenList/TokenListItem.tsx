import {
  Avatar,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { memo } from 'react';
import { ListItem, ListItemButton } from './TokenList.style';
import { TokenListItemBaseProps, TokenListItemProps } from './types';

export const TokenListItem: React.FC<TokenListItemProps> = memo(
  ({ onClick, size, start, token, isBalancesLoading }) => {
    const handleClick = () => onClick?.(token.address);
    return (
      <ListItem
        secondaryAction={
          isBalancesLoading ? (
            <Skeleton variant="text" width={50} height={24} />
          ) : (
            <Typography variant="body1" noWrap>
              {token.amount ?? '0'}
            </Typography>
          )
        }
        disablePadding
        style={{
          height: `${size}px`,
          transform: `translateY(${start}px)`,
        }}
      >
        <ListItemButton onClick={handleClick} dense disableRipple>
          <ListItemAvatar>
            <Avatar src={token.logoURI} alt={token.symbol}>
              {token.symbol[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={token.symbol} secondary={token.name} />
        </ListItemButton>
      </ListItem>
    );
  },
);

export const TokenListItemSkeleton: React.FC<TokenListItemBaseProps> = ({
  size,
  start,
}) => {
  return (
    <ListItem
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
          sx={{ marginLeft: 1.5, marginRight: 2 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width={32} height={20} />}
        secondary={<Skeleton variant="text" width={128} height={20} />}
      />
    </ListItem>
  );
};
