import {
  SwapHoriz as SwapHorizIcon,
  SwapVert as SwapVertIcon,
} from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { IconButton } from './ReverseTokensButton.style';

export const ReverseTokensButton: React.FC<{ vertical?: boolean }> = ({
  vertical,
}) => {
  const { setValue, getValues } = useFormContext();
  const handleClick = () => {
    const [fromChain, fromToken, toChain, toToken] = getValues([
      SwapFormKey.FromChain,
      SwapFormKey.FromToken,
      SwapFormKey.ToChain,
      SwapFormKey.ToToken,
    ]);
    setValue(SwapFormKey.FromChain, toChain);
    setValue(SwapFormKey.FromToken, toToken);
    setValue(SwapFormKey.ToChain, fromChain);
    setValue(SwapFormKey.ToToken, fromToken);
    setValue(SwapFormKey.FromAmount, '');
  };
  return (
    <IconButton
      onClick={handleClick}
      size="small"
      aria-label="swap-destinations"
    >
      {vertical ? <SwapVertIcon /> : <SwapHorizIcon />}
    </IconButton>
  );
};
