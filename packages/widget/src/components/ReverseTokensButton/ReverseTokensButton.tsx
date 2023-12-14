import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { IconButton } from './ReverseTokensButton.style';
import { useFieldActions } from '../../stores';

export const ReverseTokensButton: React.FC<{ vertical?: boolean }> = ({
  vertical,
}) => {
  const { setAsTouched, setFieldValue } = useFieldActions();

  const handleClick = () => {
    setFieldValue('fromAmount', '', { isTouched: true });
    setAsTouched('fromChain');
    setAsTouched('fromToken');
    setAsTouched('toChain');
    setAsTouched('toToken');
  };
  return (
    <IconButton onClick={handleClick} size="small">
      {vertical ? <SwapVertIcon /> : <SwapHorizIcon />}
    </IconButton>
  );
};
