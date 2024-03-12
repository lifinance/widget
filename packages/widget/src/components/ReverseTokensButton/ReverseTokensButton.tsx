import { ArrowDownward, ArrowForward } from '@mui/icons-material';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { useToAddressReset } from '../../hooks/useToAddressReset.js';
import { useFieldActions } from '../../stores/form/useFieldActions.js';
import { IconCard, ReverseContainer } from './ReverseTokensButton.style.js';

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
    <ReverseContainer>
      <IconCard onClick={handleClick}>
        {vertical ? (
          <ArrowDownward fontSize="inherit" />
        ) : (
          <ArrowForward fontSize="inherit" />
        )}
      </IconCard>
    </ReverseContainer>
  );
};
