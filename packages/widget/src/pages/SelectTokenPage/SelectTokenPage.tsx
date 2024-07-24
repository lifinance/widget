import { Box } from '@mui/material';
import type { FC } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChainSelect } from '../../components/ChainSelect/ChainSelect.js';
import { PageContainer } from '../../components/PageContainer.js';
import { TokenList } from '../../components/TokenList/TokenList.js';
import { useContentHeight } from '../../hooks/useContentHeight.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useScrollableOverflowHidden } from '../../hooks/useScrollableContainer.js';
import { useSwapOnly } from '../../hooks/useSwapOnly.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import type { FormTypeProps } from '../../stores/form/types.js';
import { SearchTokenInput } from './SearchTokenInput.js';

const minTokenListHeight = 360;

export const SelectTokenPage: FC<FormTypeProps> = ({ formType }) => {
  useScrollableOverflowHidden();
  const { navigateBack } = useNavigateBack();
  const headerRef = useRef<HTMLElement>(null);
  const listParentRef = useRef<HTMLUListElement | null>(null);
  const contentHeight = useContentHeight({ listParentRef });

  // TODO: question: can we move this in to useContentHeightHook
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

  // TODO: question: can we move this in to useContentHeightHook
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
        parentRef={listParentRef}
        height={tokenListHeight}
        onClick={navigateBack}
        formType={formType}
      />
    </PageContainer>
  );
};
