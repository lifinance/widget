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
import { formatTokenPrice } from '../../utils';
import { ListItem, ListItemButton } from './TokenList.style';
import type { TokenListItemButtonProps, TokenListItemProps } from './types';

export const TokenListItem: React.FC<TokenListItemProps> = memo(
  ({
    onClick,
    size,
    start,
    token,
    showBalance,
    isBalanceLoading,
    startAdornment,
    endAdornment,
  }) => {
    const handleClick = () => onClick?.(token.address);
    return (
      <ListItem
        disablePadding
        style={{
          height: `${size}px`,
          transform: `translateY(${start}px)`,
        }}
      >
        {startAdornment}
        <TokenListItemButton
          token={token}
          showBalance={showBalance}
          isBalanceLoading={isBalanceLoading}
          onClick={handleClick}
        />
        {endAdornment}
      </ListItem>
    );
  },
);

export const TokenListItemButton: React.FC<TokenListItemButtonProps> = ({
  onClick,
  token,
  showBalance,
  isBalanceLoading,
}) => {
  const { t } = useTranslation();
  const tokenPrice = formatTokenPrice(token.amount, token.priceUSD);
  return (
    <ListItemButton onClick={onClick} dense>
      <ListItemAvatar>
        <Avatar src={token.logoURI} alt={token.symbol}>
          {token.symbol[0]}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={token.symbol} secondary={token.name} />
      {showBalance ? (
        isBalanceLoading ? (
          <TokenAmountSkeleton />
        ) : (
          <Box sx={{ textAlign: 'right' }}>
            {Number(token.amount) ? (
              <Typography variant="body1" noWrap>
                {t('format.number', {
                  value: token.amount,
                })}
              </Typography>
            ) : null}
            {tokenPrice ? (
              <Typography
                fontWeight={400}
                fontSize={12}
                color="text.secondary"
                data-price={token.priceUSD}
              >
                {t(`format.currency`, {
                  value: tokenPrice,
                })}
              </Typography>
            ) : null}
          </Box>
        )
      ) : null}
    </ListItemButton>
  );
};

export const TokenListItemSkeleton = () => {
  return (
    <ListItem
      secondaryAction={<TokenAmountSkeleton />}
      disablePadding
      sx={{ position: 'relative', flexDirection: 'row', alignItems: 'center' }}
    >
      <ListItemAvatar>
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          sx={{ marginLeft: 1.5, marginRight: 2 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width={48} height={20} />}
        secondary={<Skeleton variant="text" width={96} height={20} />}
      />
    </ListItem>
  );
};

export const TokenAmountSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Skeleton variant="text" width={56} height={24} />
      <Skeleton variant="text" width={48} height={18} />
    </Box>
  );
};
