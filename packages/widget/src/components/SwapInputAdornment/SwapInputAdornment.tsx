import { InputAdornment, Skeleton } from '@mui/material';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { formatTokenAmount, formatTokenPrice } from '../../utils/format';
import {
  SwapMaxAmountTypography,
  SwapPriceTypography,
} from './SwapInputAdornment.style';

export const SwapInputAdornment: React.FC<SwapFormTypeProps> = ({
  formType,
}) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const [chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });
  const { token, tokenWithBalance, isLoading } = useTokenBalance(
    chainId,
    tokenAddress,
  );

  const amount = useMemo(
    () =>
      tokenWithBalance ? formatTokenAmount(tokenWithBalance.amount) : null,
    [tokenWithBalance],
  );

  const handleMax = () => {
    setValue(SwapFormKeyHelper.getAmountKey(formType), amount);
  };

  return (
    <InputAdornment position="end">
      {
        isLoading ? (
          <Skeleton
            variant="rectangular"
            width={96}
            height={24}
            sx={{ borderRadius: 1 }}
          />
        ) : formType === 'from' && token && amount ? (
          <SwapMaxAmountTypography
            onClick={handleMax}
            role="button"
            sx={{
              userSelect: 'none',
            }}
            data-amount={tokenWithBalance?.amount}
          >
            {t(`swap.maxAmount`, {
              amount,
            })}
          </SwapMaxAmountTypography>
        ) : null
        /* <SwapPrice price={tokenWithBalance?.priceUSD} formType={formType} /> */
      }
    </InputAdornment>
  );
};

const SwapPrice: React.FC<SwapFormTypeProps & { price?: string }> = ({
  formType,
  price,
}) => {
  const { t } = useTranslation();
  const value = useWatch({
    name: SwapFormKeyHelper.getAmountKey(formType),
  });

  return (
    <SwapPriceTypography variant="body2" color="text.secondary">
      {t(`swap.approximateCurrency`, {
        value: formatTokenPrice(value, price),
      })}
    </SwapPriceTypography>
  );
};
