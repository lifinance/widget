import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { Box, Collapse } from '@mui/material';
import { useFromTokenSufficiency } from '../../hooks/useFromTokenSufficiency.js';
import { useGasSufficiency } from '../../hooks/useGasSufficiency.js';
import { FundsSufficiencyMessage } from './FundsSufficiencyMessage.js';
import { GasSufficiencyMessage } from './GasSufficiencyMessage.js';

interface GasMessageProps extends BoxProps {
  route?: Route;
}

export const GasMessage: React.FC<GasMessageProps> = ({ route, ...props }) => {
  const { insufficientGas } = useGasSufficiency(route);
  const { insufficientFromToken } = useFromTokenSufficiency(route);

  const validInsufficientGas = insufficientGas?.length;

  return (
    <Collapse
      timeout={225}
      in={Boolean(insufficientFromToken || validInsufficientGas)}
      unmountOnExit
      mountOnEnter
    >
      <Box {...props}>
        {insufficientFromToken ? (
          <FundsSufficiencyMessage />
        ) : validInsufficientGas ? (
          <GasSufficiencyMessage insufficientGas={insufficientGas} />
        ) : null}
      </Box>
    </Collapse>
  );
};
