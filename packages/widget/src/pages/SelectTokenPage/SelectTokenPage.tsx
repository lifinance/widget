import { Box, Container } from '@mui/material';
import type { FC } from 'react';
import { ChainSelect } from '../../components/ChainSelect';
import { TokenList } from '../../components/TokenList';
import { useNavigateBack } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SearchTokenInput } from './SearchTokenInput';

export const SelectTokenPage: FC<SwapFormTypeProps> = ({ formType }) => {
  const { navigateBack } = useNavigateBack();

  return (
    <Container disableGutters>
      <Box pt={1} pb={2} px={3}>
        <ChainSelect formType={formType} />
        <Box mt={2}>
          <SearchTokenInput />
        </Box>
      </Box>
      <TokenList height={360} onClick={navigateBack} formType={formType} />
    </Container>
  );
};
