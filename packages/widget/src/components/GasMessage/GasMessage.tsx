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

  const selectedTool = route?.steps[0]?.tool;
  const bridgesForGasWarning = ['connext', 'stargate'];

  // Connext and Stargate require gas to be paid in the native token of the chain
  // Hence, SAFE wallet would required a minimum amount of native token to be present in the wallet
  const showGasWarningForSAFE =
    isMultisigSigner && selectedTool
      ? bridgesForGasWarning.includes(selectedTool)
      : true;

  const validInsufficientGas = insufficientGas?.length && showGasWarningForSAFE;

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
