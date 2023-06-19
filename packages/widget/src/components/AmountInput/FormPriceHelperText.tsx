import type { TokenAmount } from '@lifi/sdk';
import { FormHelperText, Skeleton, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTokenAddressBalance } from '../../hooks';
import type { FormTypeProps } from '../../providers';
import { FormKeyHelper } from '../../providers';
import { formatTokenAmount, formatTokenPrice } from '../../utils';

export const FormPriceHelperText: React.FC<FormTypeProps> = ({ formType }) => {
  const [chainId, tokenAddress] = useWatch({
    name: [
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType),
    ],
  });

  const { token, isLoading } = useTokenAddressBalance(chainId, tokenAddress);

  return (
    <FormPriceHelperTextBase
      formType={formType}
      isLoading={isLoading}
      tokenAddress={tokenAddress}
      token={token}
    />
  );
};

export const FormPriceHelperTextBase: React.FC<
  FormTypeProps & {
    isLoading?: boolean;
    tokenAddress?: string;
    token?: TokenAmount;
  }
> = ({ formType, isLoading, tokenAddress, token }) => {
  const { t } = useTranslation();
  const amount = useWatch({
    name: FormKeyHelper.getAmountKey(formType),
  });

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
            value: formatTokenAmount(token?.amount),
          })}`}
        </Typography>
      ) : null}
    </FormHelperText>
  );
};
