import { SwapVert as SwapVertIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { SwapFormKey } from '../providers/SwapFormProvider';

export const ReverseTokensButton: React.FC = () => {
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
      size="medium"
      aria-label="swap-destinations"
      color="inherit"
    >
      <SwapVertIcon />
    </IconButton>
  );
};
