import { TokenAmount } from '@lifi/sdk';
import { useTokenSearch } from '@lifi/widget/hooks/useTokenSearch';
import { Box, Typography } from '@mui/material';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDebouncedWatch, useTokenBalances } from '../../hooks';
import {
  SwapFormKey,
  SwapFormKeyHelper,
} from '../../providers/SwapFormProvider';
import { useWallet } from '../../providers/WalletProvider';
import { TokenListProps } from './types';
import { createTokenAmountSkeletons } from './utils';
import { VirtualizedTokenList } from './VirtualizedTokenList';

export const TokenList: FC<TokenListProps> = ({
  formType,
  height,
  onClick,
}) => {
  const { t } = useTranslation();
  const parentRef = useRef<HTMLUListElement | null>(null);
  const { account } = useWallet();
  const { setValue, getValues } = useFormContext();
  const [tokenSkeletons] = useState(createTokenAmountSkeletons);
  const [selectedChainId] = useWatch({
    name: [SwapFormKeyHelper.getChainKey(formType)],
  });
  const [searchTokensFilter]: string[] = useDebouncedWatch(
    [SwapFormKey.SearchTokensFilter],
    250,
  );

  const {
    tokens: tokensWithoutBalance,
    tokensWithBalance,
    isLoading,
    isBalanceLoading,
  } = useTokenBalances(selectedChainId);

  const filteredTokens = useMemo(() => {
    let chainTokens = tokensWithBalance ?? tokensWithoutBalance ?? [];
    const searchFilter = searchTokensFilter?.toUpperCase() ?? '';
    chainTokens = searchTokensFilter
      ? chainTokens.filter(
          (token) =>
            token.name.toUpperCase().includes(searchFilter) ||
            token.symbol.toUpperCase().includes(searchFilter) ||
            token.address.toUpperCase().includes(searchFilter),
        )
      : chainTokens;
    return chainTokens;
  }, [searchTokensFilter, tokensWithBalance, tokensWithoutBalance]);

  const tokenSearchEnabled = !filteredTokens.length && !isLoading;

  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(searchTokensFilter, selectedChainId, tokenSearchEnabled);

  const tokens =
    isLoading || (tokenSearchEnabled && isSearchedTokenLoading)
      ? tokenSkeletons
      : filteredTokens.length
      ? filteredTokens
      : searchedToken
      ? [searchedToken]
      : filteredTokens;

  const handleTokenClick = useCallback(
    (tokenAddress: string) => {
      setValue(SwapFormKeyHelper.getTokenKey(formType), tokenAddress);
      setValue(SwapFormKeyHelper.getAmountKey(formType), '');
      const oppositeFormType = formType === 'from' ? 'to' : 'from';
      const [selectedOppositeToken, selectedOppositeChain, selectedChain] =
        getValues([
          SwapFormKeyHelper.getTokenKey(oppositeFormType),
          SwapFormKeyHelper.getChainKey(oppositeFormType),
          SwapFormKeyHelper.getChainKey(formType),
        ]);
      if (
        selectedOppositeToken === tokenAddress &&
        selectedOppositeChain === selectedChain
      ) {
        setValue(SwapFormKeyHelper.getTokenKey(oppositeFormType), '');
      }
      onClick?.();
    },
    [formType, getValues, onClick, setValue],
  );

  return (
    <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
      {!tokens.length ? (
        <Typography variant="body1" align="center" py={2} px={3}>
          {t('swap.couldntFindTokens')}
        </Typography>
      ) : null}
      <VirtualizedTokenList
        tokens={tokens as TokenAmount[]}
        scrollElementRef={parentRef}
        onClick={handleTokenClick}
        chainId={selectedChainId}
        isBalanceLoading={isBalanceLoading}
        showBalance={account.isActive}
      />
    </Box>
  );
};
