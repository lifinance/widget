import { Box } from '@mui/material';
import type { FC } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { ChainSelect } from '../../components/ChainSelect';
import { PageContainer } from '../../components/PageContainer';
import { TokenList } from '../../components/TokenList';
import {
  useContentHeight,
  useNavigateBack,
  useScrollableOverflowHidden,
  useSwapOnly,
} from '../../hooks';
import type { FormTypeProps } from '../../stores';
import { SearchTokenInput } from './SearchTokenInput';

const minTokenListHeight = 360;

export const SelectTokenPage: FC<FormTypeProps> = ({ formType }) => {
  useScrollableOverflowHidden();
  const { navigateBack } = useNavigateBack();
  const headerRef = useRef<HTMLElement>(null);
  const contentHeight = useContentHeight();
  const [tokenListHeight, setTokenListHeight] = useState(0);
  const swapOnly = useSwapOnly();

  useLayoutEffect(() => {
    setTokenListHeight(
      Math.max(
        contentHeight - (headerRef.current?.offsetHeight ?? 0),
        minTokenListHeight,
      ),
    );
  }, [contentHeight]);

  const hideChainSelect = swapOnly && formType === 'to';

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
        onClick={navigateBack}
        formType={formType}
      />
    </PageContainer>
  );
};
