import { Box, Container } from '@mui/material';
import { FC, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenList } from '../../components/TokenList';
import { useContentHeight, useScrollableOverflowHidden } from '../../hooks';
import { SwapFormDirection } from '../../providers/SwapFormProvider';
import { ChainSelect } from './ChainSelect';
import { SearchTokenInput } from './SearchTokenInput';

export const SelectTokenPage: FC<{ formType: SwapFormDirection }> = ({
  formType,
}) => {
  useScrollableOverflowHidden();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const contentHeight = useContentHeight();
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleTokenClick = () => {
    navigate(-1);
  };

  useLayoutEffect(() => {
    setHeaderHeight(contentHeight - (headerRef.current?.offsetHeight ?? 0));
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
        height={headerHeight}
        onClick={handleTokenClick}
        formType={formType}
      />
    </Container>
  );
};
