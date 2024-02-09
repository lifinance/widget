import { InputAdornment, Skeleton } from '@mui/material';
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

  const listPercentage: any = [
    {
      label: '25%',
      value: 0.25,
    },
    {
      label: '50%',
      value: 0.5,
    },
    {
      label: '75%',
      value: 0.75,
    },
  ];

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

  const handleSelectedPercent = (value: number) => {
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
      const formatAmount = formatUnits(maxAmount, token.decimals);
      setFieldValue(
        FormKeyHelper.getAmountKey(formType),
        (Number(formatAmount) * value).toString(),
        {
          isTouched: true,
        },
      );
    }
  };

  return (
    <div style={{ padding: '0px 16px 14px 16px' }}>
      {isLoading && tokenAddress ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Skeleton variant="text" width={40} height={40} />
          <Skeleton variant="text" width={40} height={40} />
          <Skeleton variant="text" width={40} height={40} />
          <Skeleton variant="text" width={40} height={40} />
        </div>
      ) : formType === 'from' && token?.amount ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {listPercentage.map((item: any) => (
              <div
                key={item.value}
                onClick={() => handleSelectedPercent(item.value)}
                style={{
                  fontSize: '14px',
                  background: '#6AC7F533',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div
            onClick={handleMax}
            style={{
              fontSize: '14px',
              background: '#6AC7F533',
              padding: '2px 8px',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
          >
            100%
          </div>
        </div>
      ) : null}
    </div>
  );
};
