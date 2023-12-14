import { InputAdornment, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import {
  useAvailableChains,
  useGasRecommendation,
  useTokenAddressBalance,
} from '../../hooks';
import type { FormTypeProps } from '../../stores';
import { Button } from './AmountInputAdornment.style';
import { useFieldActions, useFieldValues, FormKeyHelper } from '../../stores';

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
        <Skeleton
          variant="rectangular"
          width={46}
          height={24}
          sx={{ borderRadius: 0.5 }}
        />
      ) : formType === 'from' && token?.amount ? (
        <Button onClick={handleMax}>{t('button.max')}</Button>
      ) : null}
    </InputAdornment>
  );
};
