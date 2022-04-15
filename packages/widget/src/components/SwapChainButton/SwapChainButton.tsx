import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain, useToken } from '../../hooks';
import { SwapFormKeyHelper } from '../../providers/SwapFormProvider';
import { routes } from '../../utils/routes';
import { Button } from './SwapChainButton.style';
import { SwapChainButtonProps } from './types';

export const SwapChainButton: React.FC<SwapChainButtonProps> = ({
  onClick,
  formType,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });
  const { chain } = useChain(chainId);
  const { token } = useToken(chainId, tokenAddress);

  const handleClick = () => {
    navigate(formType === 'from' ? routes.fromToken : routes.toToken);
  };

  return (
    <Button
      variant="outlined"
      endIcon={<KeyboardArrowDownIcon />}
      onClick={handleClick}
      formType={formType}
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
