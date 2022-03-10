import { useToken } from '@lifinance/widget/hooks/useToken';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { useFormState, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKeyHelper } from '../../providers/SwapFormProvider';
import { Button } from './SwapChainButton.style';
import { SwapChainButtonProps } from './types';

export const SwapChainButton: React.FC<SwapChainButtonProps> = ({
  onClick,
  formType,
}) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormState();
  const [chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });

  const { chain, token } = useToken(chainId, tokenAddress);

  return (
    <Button
      variant="outlined"
      endIcon={<KeyboardArrowDownIcon />}
      onClick={() => onClick?.(formType)}
      disabled={isSubmitting}
      disableElevation
      disableRipple
      fullWidth
    >
      {chain && token
        ? `${token.symbol} on ${chain.name}`
        : t(`swap.selectChainAndToken`)}
    </Button>
  );
};
