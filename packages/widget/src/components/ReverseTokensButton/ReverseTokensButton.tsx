import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useFieldActions } from '../../stores';
import { IconButton } from './ReverseTokensButton.style';

export const ReverseTokensButton: React.FC<{ vertical?: boolean }> = ({
  vertical,
}) => {
  const { setFieldValue, getFieldValues } = useFieldActions();

  const handleClick = () => {
    const [fromChain, fromToken, toChain, toToken] = getFieldValues(
      'fromChain',
      'fromToken',
      'toChain',
      'toToken',
    );
    setFieldValue('fromAmount', '', { isTouched: true });
    setFieldValue('fromChain', toChain, { isTouched: true });
    setFieldValue('fromToken', toToken, { isTouched: true });
    setFieldValue('toChain', fromChain, { isTouched: true });
    setFieldValue('toToken', fromToken, { isTouched: true });
  };
  return (
    <IconButton onClick={handleClick} size="small">
      {vertical ? <SwapVertIcon /> : <SwapHorizIcon />}
    </IconButton>
  );
};
