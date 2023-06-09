import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useFormContext } from 'react-hook-form';
import { FormKey } from '../../providers';
import { IconButton } from './ReverseTokensButton.style';

export const ReverseTokensButton: React.FC<{ vertical?: boolean }> = ({
  vertical,
}) => {
  const { setValue, getValues } = useFormContext();
  const handleClick = () => {
    const [fromChain, fromToken, toChain, toToken] = getValues([
      FormKey.FromChain,
      FormKey.FromToken,
      FormKey.ToChain,
      FormKey.ToToken,
    ]);
    setValue(FormKey.FromAmount, '', { shouldTouch: true });
    setValue(FormKey.FromChain, toChain, { shouldTouch: true });
    setValue(FormKey.FromToken, toToken, { shouldTouch: true });
    setValue(FormKey.ToChain, fromChain, { shouldTouch: true });
    setValue(FormKey.ToToken, fromToken, { shouldTouch: true });
  };
  return (
    <IconButton onClick={handleClick} size="small">
      {vertical ? <SwapVertIcon /> : <SwapHorizIcon />}
    </IconButton>
  );
};
