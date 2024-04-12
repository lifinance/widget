import { Box } from '@mui/material';
import type { FC } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useHeader } from '../../stores/header/useHeaderStore.js';
import { ChainSelect } from '../../components/ChainSelect/ChainSelect.js';
import { PageContainer } from '../../components/PageContainer.js';
import { TokenList } from '../../components/TokenList/TokenList.js';
import { useContentHeight } from '../../hooks/useContentHeight.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useScrollableOverflowHidden } from '../../hooks/useScrollableContainer.js';
import { useSwapOnly } from '../../hooks/useSwapOnly.js';
import type { FormTypeProps } from '../../stores/form/types.js';
import { SearchTokenInput } from './SearchTokenInput.js';
import { useTranslation } from 'react-i18next';

const minTokenListHeight = 360;

export const SelectTokenPage: FC<FormTypeProps> = ({ formType }) => {
  useScrollableOverflowHidden();
  const { navigateBack } = useNavigateBack();
  const headerRef = useRef<HTMLElement>(null);
  const contentHeight = useContentHeight();
  const [tokenListHeight, setTokenListHeight] = useState(0);
  const swapOnly = useSwapOnly();

  const { subvariant } = useWidgetConfig();
  const { t } = useTranslation();
  const title =
    formType === 'from'
      ? subvariant === 'custom'
        ? t(`header.payWith`)
        : t(`header.from`)
      : t(`header.to`);

  useHeader(title);

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
      <Box pb={2} px={3} ref={headerRef}>
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
