import { Box, Container } from '@mui/material';
import { FC, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TokenList } from '../../components/TokenList';
import { useContentHeight } from '../../hooks';
import { SwapFormDirection } from '../../providers/SwapFormProvider';
import { ElementId } from '../../utils/elements';
import { ChainSelect } from './ChainSelect';
import { SearchTokenInput } from './SearchTokenInput';

export const SelectTokenPage: FC<{ formType: SwapFormDirection }> = ({
  formType,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const contentHeight = useContentHeight();

  const handleTokenClick = () => {
    navigate(-1);
  };

  useLayoutEffect(() => {
    const element = document.getElementById(ElementId.ScrollableContainer);
    if (element) {
      element.style.overflowY = 'hidden';
    }
    return () => {
      if (element) {
        element.style.overflowY = 'scroll';
      }
    };
  }, []);

  return (
    <Container disableGutters>
      <Box py={1} px={3}>
        <ChainSelect formType={formType} />
        <Box mt={2}>
          <SearchTokenInput />
        </Box>
      </Box>
      <TokenList
        height={contentHeight - 208}
        onClick={handleTokenClick}
        formType={formType}
      />
    </Container>
  );
};
