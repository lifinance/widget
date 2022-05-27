import { FormHelperText, Skeleton } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTokenBalance } from '../../hooks';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { formatTokenPrice } from '../../utils/format';
import { PriceTypography } from '../PriceTypography';

export const FormPriceHelperText: React.FC<
  SwapFormTypeProps & { selected: boolean }
> = ({ formType, selected }) => {
  const { t } = useTranslation();
  const [amount, chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getAmountKey(formType),
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });
  const { token, isLoading, isFetching } = useTokenBalance(
    chainId,
    tokenAddress,
  );

  const fromAmountTokenPrice = formatTokenPrice(amount, token?.priceUSD);
  const maxAmountTokenPrice = formatTokenPrice(token?.amount, token?.priceUSD);

  return (
    <FormHelperText
      component="div"
      sx={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}
    >
      <PriceTypography
        color={fromAmountTokenPrice ? 'text.secondary' : 'grey.600'}
        marginLeft={selected ? 8 : 2}
        lineHeight={1.3334}
      >
        {t(`swap.currency`, {
          value: fromAmountTokenPrice,
        })}
      </PriceTypography>
      {isLoading && isFetching ? (
        <Skeleton
          variant="text"
          width={48}
          height={16}
          sx={{ borderRadius: 0.5 }}
        />
      ) : maxAmountTokenPrice ? (
        <PriceTypography color="text.secondary" lineHeight={1.3334}>
          {t(`swap.currency`, {
            value: maxAmountTokenPrice,
          })}
        </PriceTypography>
      ) : null}
    </FormHelperText>
  );
};
