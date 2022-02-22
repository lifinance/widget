import { InputAdornment, Skeleton, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { formatTokenAmount } from '../../utils/format';
import {
  SwapMaxAmountTypography,
  SwapPriceTypography,
} from './SwapInputAdornment.style';

export const SwapInputAdornment: React.FC<SwapFormTypeProps> = ({
  formType,
}) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const [chainKey, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });
  const { token, tokenWithBalance, isLoading } = useTokenBalance(
    chainKey,
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
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          width={formType === 'from' ? 160 : 96}
          height={20}
          sx={{ borderRadius: '6px' }}
        />
      ) : (
        <>
          {formType === 'from' && token && amount ? (
            <>
              <SwapMaxAmountTypography
                variant="body2"
                color="text.primary"
                onClick={handleMax}
              >
                {t(`swap.max`)}
              </SwapMaxAmountTypography>
              <Typography
                variant="body2"
                color="text.secondary"
                data-amount={tokenWithBalance?.amount}
              >
                {t(`swap.maxAmount`, {
                  amount,
                })}
              </Typography>
            </>
          ) : null}
          <SwapPriceTypography variant="body2" color="text.secondary">
            {t(`swap.price`, { price: tokenWithBalance?.priceUSD ?? 0 })}
          </SwapPriceTypography>
        </>
      )}
    </InputAdornment>
  );
};
