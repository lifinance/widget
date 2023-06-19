import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { Box, Collapse } from '@mui/material';
import { useFundsSufficiency, useGasSufficiency } from '../../hooks';
import { FundsSufficiencyMessage } from './FundsSufficiencyMessage';
import { GasSufficiencyMessage } from './GasSufficiencyMessage';

interface GasMessageProps extends BoxProps {
  route?: Route;
}

export const GasMessage: React.FC<GasMessageProps> = ({ route, ...props }) => {
  const { insufficientGas } = useGasSufficiency(route);
  const { insufficientFunds } = useFundsSufficiency(route);

  return (
    <Collapse
      timeout={225}
      in={Boolean(insufficientFunds || insufficientGas?.length)}
      unmountOnExit
      mountOnEnter
    >
      <Box {...props}>
        {insufficientFunds ? (
          <FundsSufficiencyMessage />
        ) : insufficientGas?.length ? (
          <GasSufficiencyMessage insufficientGas={insufficientGas} />
        ) : null}
      </Box>
    </Collapse>
  );
};
