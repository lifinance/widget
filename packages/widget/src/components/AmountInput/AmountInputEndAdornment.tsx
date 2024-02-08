import { InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { useGasRecommendation } from '../../hooks/useGasRecommendation.js';
import { useTokenAddressBalance } from '../../hooks/useTokenAddressBalance.js';
import type { FormTypeProps } from '../../stores/form/types.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldActions } from '../../stores/form/useFieldActions.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { MaxButton, MaxButtonSkeleton } from './AmountInputAdornment.style.js';

export const AmountInputEndAdornment = ({ formType }: FormTypeProps) => {
  const { t } = useTranslation();
  const { getChainById } = useAvailableChains();
  const { setFieldValue } = useFieldActions();

  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType),
  );

  // We get gas recommendations for the source chain to make sure that after pressing the Max button
  // the user will have enough funds remaining to cover gas costs
  const { data } = useGasRecommendation(chainId);

  const { token, isLoading } = useTokenAddressBalance(chainId, tokenAddress);

  const handleMax = () => {
    if (!token?.amount) {
      return;
    }
    const chain = getChainById(chainId);
    let maxAmount = token.amount;
    if (
      chain?.nativeToken.address === tokenAddress &&
      data?.available &&
      data?.recommended
    ) {
      const recommendedAmount = BigInt(data.recommended.amount) / 2n;
      if (token.amount > recommendedAmount) {
        maxAmount = token.amount - recommendedAmount;
      }
    }
    if (maxAmount) {
      setFieldValue(
        FormKeyHelper.getAmountKey(formType),
        formatUnits(maxAmount, token.decimals),
        {
          isTouched: true,
        },
      );
    }
  };

  return (
    <InputAdornment position="end">
      {isLoading && tokenAddress ? (
        <MaxButtonSkeleton variant="rectangular" />
      ) : formType === 'from' && token?.amount ? (
        <MaxButton onClick={handleMax}>{t('button.max')}</MaxButton>
      ) : null}
    </InputAdornment>
  );
};
