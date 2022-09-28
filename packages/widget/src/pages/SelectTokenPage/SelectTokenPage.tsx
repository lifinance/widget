import { Box, Container } from '@mui/material';
import type { FC } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { ChainSelect } from '../../components/ChainSelect';
import { TokenList } from '../../components/TokenList';
import {
  useContentHeight,
  useNavigateBack,
  useScrollableOverflowHidden,
} from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SearchTokenInput } from './SearchTokenInput';

const minTokenListHeight = 360;

export const SelectTokenPage: FC<SwapFormTypeProps> = ({ formType }) => {
  useScrollableOverflowHidden();
  const { navigateBack } = useNavigateBack();
  const headerRef = useRef<HTMLElement>(null);
  const contentHeight = useContentHeight();
  const [tokenListHeight, setTokenListHeight] = useState(0);

  useLayoutEffect(() => {
    setTokenListHeight(
      Math.max(
        contentHeight - (headerRef.current?.offsetHeight ?? 0),
        minTokenListHeight,
      ),
    );
  }, [contentHeight]);

  return (
    <Container disableGutters>
      <Box pt={1} pb={2} px={3} ref={headerRef}>
        <ChainSelect formType={formType} />
        <Box mt={2}>
          <SearchTokenInput />
        </Box>
      </Box>
      <TokenList
        height={tokenListHeight}
        onClick={navigateBack}
        formType={formType}
      />
    </Container>
  );
};
