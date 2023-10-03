import type { Route } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import { Box, Collapse } from '@mui/material';
import { useFromTokenSufficiency, useGasSufficiency } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { FundsSufficiencyMessage } from './FundsSufficiencyMessage';
import { GasSufficiencyMessage } from './GasSufficiencyMessage';

interface GasMessageProps extends BoxProps {
  route?: Route;
}

export const GasMessage: React.FC<GasMessageProps> = ({ route, ...props }) => {
  const { insufficientGas } = useGasSufficiency(route);
  const { insufficientFromToken } = useFromTokenSufficiency(route);
  const { sdkConfig } = useWidgetConfig();
  const isMultisigSigner = sdkConfig?.multisigConfig?.isMultisigSigner;

  const validInsufficientGas = insufficientGas?.length && !isMultisigSigner;

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
