import { Box, Container } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenList } from '../../components/TokenList';
import { useContentHeight, useScrollableOverflowHidden } from '../../hooks';
import { SwapFormDirection } from '../../providers/SwapFormProvider';
import { ChainSelect } from './ChainSelect';
import { SearchTokenInput } from './SearchTokenInput';

export const SelectTokenPage: FC<{ formType: SwapFormDirection }> = ({
  formType,
}) => {
  const navigate = useNavigate();
  useScrollableOverflowHidden();
  const contentHeight = useContentHeight();

  const handleTokenClick = () => {
    navigate(-1);
  };

  return (
    <Container disableGutters>
      <Box pt={1} pb={2} px={3}>
        <ChainSelect formType={formType} />
        <Box mt={2}>
          <SearchTokenInput />
        </Box>
      </Box>
      <TokenList
        height={contentHeight - 184}
        onClick={handleTokenClick}
        formType={formType}
      />
    </Container>
  );
};
