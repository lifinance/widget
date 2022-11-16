import { FormHelperText, Skeleton, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTokenAddressBalance } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper } from '../../providers';
import { formatTokenPrice } from '../../utils';

export const FormPriceHelperText: React.FC<SwapFormTypeProps> = ({
  formType,
}) => {
  const { t } = useTranslation();
  const [amount, chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getAmountKey(formType),
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });

  const { token, isLoading } = useTokenAddressBalance(chainId, tokenAddress);

  const fromAmountTokenPrice = formatTokenPrice(amount, token?.priceUSD);

  return (
    <FormHelperText
      component="div"
      sx={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}
    >
      <Typography
        color={fromAmountTokenPrice ? 'text.secondary' : 'grey.600'}
        fontWeight={400}
        fontSize={12}
        marginLeft={8}
        lineHeight={1.3334}
        flex={1}
        sx={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {t(`format.currency`, {
          value: fromAmountTokenPrice,
        })}
      </Typography>
      {isLoading && tokenAddress ? (
        <Skeleton
          variant="text"
          width={48}
          height={16}
          sx={{ borderRadius: 0.25 }}
        />
      ) : token?.amount ? (
        <Typography
          fontWeight={400}
          fontSize={12}
          color="text.secondary"
          lineHeight={1.3334}
          pl={0.25}
        >
          {`/ ${t(`format.number`, {
            value: token?.amount,
          })}`}
        </Typography>
      ) : null}
    </FormHelperText>
  );
};
