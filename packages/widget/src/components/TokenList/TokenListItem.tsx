import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTokenPrice } from '../../utils/format';
import { PriceTypography } from '../PriceTypography';
import { ListItem, ListItemButton } from './TokenList.style';
import { TokenListItemBaseProps, TokenListItemProps } from './types';

export const TokenListItem: React.FC<TokenListItemProps> = memo(
  ({ onClick, size, start, token, showBalance }) => {
    const { t } = useTranslation();
    const handleClick = () => onClick?.(token.address);
    const tokenPrice = formatTokenPrice(token.amount, token.priceUSD);
    return (
      <ListItem
        secondaryAction={
          showBalance ? (
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1" noWrap>
                {token.amount ?? '0'}
              </Typography>
              {tokenPrice ? (
                <PriceTypography noWrap data-price={token.priceUSD}>
                  {t(`swap.currency`, {
                    value: tokenPrice,
                  })}
                </PriceTypography>
              ) : null}
            </Box>
          ) : null
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
          width={32}
          height={32}
          sx={{ marginLeft: 2, marginRight: 2 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width={48} height={20} />}
        secondary={<Skeleton variant="text" width={128} height={20} />}
      />
    </ListItem>
  );
};
