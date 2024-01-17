import { Box } from '@mui/material';
import type { FC } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { ChainSelect } from '../../components/ChainSelect';
import { PageContainer } from '../../components/PageContainer';
import { TokenList } from '../../components/TokenList';
import {
  useAvailableChains,
  useContentHeight,
  useNavigateBack,
  useScrollableOverflowHidden,
  useSwapOnly,
} from '../../hooks';
import type { FormTypeProps } from '../../stores';
import { SearchTokenInput } from './SearchTokenInput';
import {
  useBookmarks,
  useBookmarksActions,
  useFieldActions,
} from '../../stores';

const minTokenListHeight = 360;

export const SelectTokenPage: FC<FormTypeProps> = ({ formType }) => {
  useScrollableOverflowHidden();
  const { navigateBack } = useNavigateBack();
  const headerRef = useRef<HTMLElement>(null);
  const contentHeight = useContentHeight();
  const [tokenListHeight, setTokenListHeight] = useState(0);
  const swapOnly = useSwapOnly();
  const { getChainById } = useAvailableChains();
  const { getFieldValues, resetField } = useFieldActions();
  const { selectedBookmarkWallet } = useBookmarks();
  const { setSelectedBookmarkWallet } = useBookmarksActions();

  useLayoutEffect(() => {
    setTokenListHeight(
      Math.max(
        contentHeight - (headerRef.current?.offsetHeight ?? 0),
        minTokenListHeight,
      ),
    );
  }, [contentHeight]);

  const hideChainSelect = swapOnly && formType === 'to';

  const ensureToAddressIsAlignedWithToChainType = () => {
    const [toToken, fromToken, fromChainId, toChainId] = getFieldValues(
      'toToken',
      'fromToken',
      'fromChain',
      'toChain',
    );

    const fromChain = getChainById(fromChainId);
    const toChain = getChainById(toChainId);

    const requiredChainType =
      !!fromToken && !!toToken && !!fromChain && !!toChain && toChain.chainType;

    if (
      requiredChainType &&
      selectedBookmarkWallet &&
      selectedBookmarkWallet.chainType !== requiredChainType
    ) {
      setSelectedBookmarkWallet();
      resetField('toAddress');
    }
  };
  const handleTokenListItemClick = () => {
    ensureToAddressIsAlignedWithToChainType();
    navigateBack();
  };

  return (
    <PageContainer disableGutters>
      <Box pt={1} pb={2} px={3} ref={headerRef}>
        {!hideChainSelect ? <ChainSelect formType={formType} /> : null}
        <Box mt={!hideChainSelect ? 2 : 0}>
          <SearchTokenInput />
        </Box>
      </Box>
      <TokenList
        height={tokenListHeight}
        onClick={handleTokenListItemClick}
        formType={formType}
      />
    </PageContainer>
  );
};
