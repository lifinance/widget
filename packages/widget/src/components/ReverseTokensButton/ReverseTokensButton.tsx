import {
  SwapHoriz as SwapHorizIcon,
  SwapVert as SwapVertIcon,
} from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import { SwapFormKey } from '../../providers';
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
    setValue(SwapFormKey.FromAmount, '', { shouldTouch: true });
    setValue(SwapFormKey.FromChain, toChain, { shouldTouch: true });
    setValue(SwapFormKey.FromToken, toToken, { shouldTouch: true });
    setValue(SwapFormKey.ToChain, fromChain, { shouldTouch: true });
    setValue(SwapFormKey.ToToken, fromToken, { shouldTouch: true });
  };
  return (
    <IconButton onClick={handleClick} size="small">
      {vertical ? <SwapVertIcon /> : <SwapHorizIcon />}
    </IconButton>
  );
};
