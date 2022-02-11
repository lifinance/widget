import { getChainByKey } from '@lifinance/sdk';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from './SwapChainButton.style';
import { SwapChainButtonProps } from './types';

export const SwapChainButton: React.FC<SwapChainButtonProps> = ({
  onClick,
  type,
}) => {
  const { t } = useTranslation();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const [chain, token] = useWatch({
    name: [`${type}Chain`, `${type}Token`],
    // defaultValue: false,
  });

  return (
    <Button
      variant="outlined"
      endIcon={<KeyboardArrowDownIcon />}
      onClick={onClick}
      disabled={isSubmitting}
      disableElevation
      disableRipple
      fullWidth
    >
      {chain && token
        ? `${token} on ${getChainByKey(chain).name}`
        : t(`swap.selectChainAndToken`)}
    </Button>
  );
};
