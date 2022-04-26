import { Avatar, FormControl } from '@mui/material';
import { ChangeEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useChain, useToken } from '../../hooks';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { formatAmount } from '../../utils/format';
import { CardContainer, CardTitle } from '../Card';
import { SwapInputAdornment } from '../SwapInputAdornment';
import { Input } from './SwapInput.style';

export const SwapInput: React.FC<SwapFormTypeProps> = ({ formType }) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const amountKey = SwapFormKeyHelper.getAmountKey(formType);
  const [amount, chainId, tokenAddress] = useWatch({
    name: [
      amountKey,
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });

  const { chain } = useChain(chainId);
  const { token } = useToken(chainId, tokenAddress);
  const isSelected = !!(chain && token);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setValue(amountKey, formatAmount(value, true));
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setValue(amountKey, formatAmount(value));
  };

  return (
    <CardContainer>
      <CardTitle>{t('swap.amount')}</CardTitle>
      <FormControl fullWidth>
        <Input
          size="small"
          autoComplete="off"
          placeholder="0"
          startAdornment={
            isSelected ? (
              <Avatar
                src={token.logoURI}
                alt={token.symbol}
                sx={{ marginLeft: 2 }}
              >
                {token.symbol[0]}
              </Avatar>
            ) : null
          }
          endAdornment={<SwapInputAdornment formType={formType} />}
          inputProps={{
            inputMode: 'decimal',
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={amount}
          name={amountKey}
          required
        />
        {/* <FormHelperText id="swap-from-helper-text">Text</FormHelperText> */}
      </FormControl>
    </CardContainer>
  );
};
