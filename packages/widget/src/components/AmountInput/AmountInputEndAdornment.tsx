import { InputAdornment, Skeleton } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import {
  useChains,
  useGasRecommendation,
  useTokenAddressBalance,
} from '../../hooks';
import type { FormTypeProps } from '../../providers';
import { FormKeyHelper } from '../../providers';
import { Button } from './AmountInputAdornment.style';

export const AmountInputEndAdornment = ({ formType }: FormTypeProps) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const { getChainById } = useChains();
  const [chainId, tokenAddress] = useWatch({
    name: [
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType),
    ],
  });
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

    setValue(
      FormKeyHelper.getAmountKey(formType),
      maxAmount && token ? formatUnits(maxAmount, token.decimals) : '',
      {
        shouldTouch: true,
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
