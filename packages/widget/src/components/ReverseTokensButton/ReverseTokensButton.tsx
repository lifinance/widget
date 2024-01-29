import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAvailableChains, useToAddressReset } from '../../hooks';
import { useFieldActions } from '../../stores';
import { IconButton } from './ReverseTokensButton.style';

export const ReverseTokensButton: React.FC<{ vertical?: boolean }> = ({
  vertical,
}) => {
  const { setFieldValue, getFieldValues } = useFieldActions();
  const { getChainById } = useAvailableChains();
  const { tryResetToAddress } = useToAddressReset();

  const handleClick = () => {
    const [fromChainId, fromToken, toChainId, toToken] = getFieldValues(
      'fromChain',
      'fromToken',
      'toChain',
      'toToken',
    );
    setFieldValue('fromAmount', '', { isTouched: true });
    setFieldValue('fromChain', toChainId, { isTouched: true });
    setFieldValue('fromToken', toToken, { isTouched: true });
    setFieldValue('toChain', fromChainId, { isTouched: true });
    setFieldValue('toToken', fromToken, { isTouched: true });

    // fromChainId becomes toChainId after using reverse
    const toChain = getChainById(fromChainId);
    if (toChain) {
      tryResetToAddress(toChain);
    }
  };
  return (
    <IconButton onClick={handleClick} size="medium">
      {vertical ? (
        <ArrowDownwardIcon fontSize="inherit" />
      ) : (
        <ArrowForwardIcon fontSize="inherit" />
      )}
    </IconButton>
  );
};
