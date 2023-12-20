import { InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import {
  useAvailableChains,
  useGasRecommendation,
  useTokenAddressBalance,
} from '../../hooks';
import type { FormTypeProps } from '../../stores';
import { FormKeyHelper, useFieldActions, useFieldValues } from '../../stores';
import { MaxButton, MaxButtonSkeleton } from './AmountInputAdornment.style';

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
    const chain = getChainById(chainId);
    let maxAmount = token?.amount;
    if (
      chain?.nativeToken.address === tokenAddress &&
      data?.available &&
      data?.recommended
    ) {
      const tokenAmount = token?.amount ?? 0n;
      const recommendedAmount = BigInt(data.recommended.amount) / 2n;
      if (tokenAmount > recommendedAmount) {
        maxAmount = tokenAmount - recommendedAmount;
      }
    }

    setFieldValue(
      FormKeyHelper.getAmountKey(formType),
      maxAmount && token ? formatUnits(maxAmount, token.decimals) : '',
      {
        isTouched: true,
      },
    );
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
