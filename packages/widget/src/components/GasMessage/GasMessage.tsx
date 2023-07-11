import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { Box, Collapse } from '@mui/material';
import { useFundsSufficiency, useGasSufficiency } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { FundsSufficiencyMessage } from './FundsSufficiencyMessage';
import { GasSufficiencyMessage } from './GasSufficiencyMessage';

interface GasMessageProps extends BoxProps {
  route?: Route;
}

export const GasMessage: React.FC<GasMessageProps> = ({ route, ...props }) => {
  const { insufficientGas } = useGasSufficiency(route);
  const { insufficientFunds } = useFundsSufficiency(route);
  const { sdkConfig } = useWidgetConfig();
  const isMultisigSigner = sdkConfig?.multisigConfig?.isMultisigSigner;

  const validInsufficientGas = insufficientGas?.length && !isMultisigSigner;

  return (
    <Collapse
      timeout={225}
      in={Boolean(insufficientFunds || validInsufficientGas)}
      unmountOnExit
      mountOnEnter
    >
      <Box {...props}>
        {insufficientFunds ? (
          <FundsSufficiencyMessage />
        ) : validInsufficientGas ? (
          <GasSufficiencyMessage insufficientGas={insufficientGas} />
        ) : null}
      </Box>
    </Collapse>
  );
};
