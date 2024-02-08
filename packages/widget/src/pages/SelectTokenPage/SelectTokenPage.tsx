import { Box } from '@mui/material';
import type { FC } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { ChainSelect } from '../../components/ChainSelect/ChainSelect.js';
import { PageContainer } from '../../components/PageContainer.js';
import { TokenList } from '../../components/TokenList/TokenList.js';
import { useContentHeight } from '../../hooks/useContentHeight.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useScrollableOverflowHidden } from '../../hooks/useScrollableContainer.js';
import { useSwapOnly } from '../../hooks/useSwapOnly.js';
import type { FormTypeProps } from '../../stores/form/types.js';
import { SearchTokenInput } from './SearchTokenInput.js';

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
