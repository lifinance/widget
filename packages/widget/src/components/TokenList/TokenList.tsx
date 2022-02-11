import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { useCallback, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useVirtual } from 'react-virtual';
import { useTokens } from '../../hooks/useToken';
import { TokenListItemButton } from './TokenList.style';
import { TokenListProps } from './types';

export const TokenList: React.FC<TokenListProps> = ({
  onClick,
  chainFormName,
  height,
}) => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const selectedChain = useWatch({
    name: chainFormName,
  });
  const { tokens } = useTokens();
  const chainTokens = tokens?.[selectedChain];
  const parentRef = useRef<HTMLUListElement | null>(null);

  const { virtualItems, totalSize } = useVirtual({
    size: chainTokens?.length ?? 0,
    parentRef,
    overscan: 5,
    paddingStart: 300,
    estimateSize: useCallback(() => 60, []),
    keyExtractor: (index) => chainTokens?.[index].address ?? index,
  });

  if (!chainTokens) {
    return null;
  }
  // console.log(virtualItems, totalSize);

  return (
    <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
      <List sx={{ padding: '8px', height: totalSize }}>
        {virtualItems.map((item) => {
          const token = chainTokens[item.index];
          return (
            <ListItem
              key={item.key}
              secondaryAction={
                <Typography variant="body1" noWrap>
                  {token.amount}
                </Typography>
              }
              disablePadding
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
              }}
            >
              <TokenListItemButton dense onClick={onClick}>
                <ListItemAvatar>
                  <Avatar src={token.logoURI} alt={token.symbol}>
                    {token.symbol[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={token.symbol} secondary={token.name} />
              </TokenListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
