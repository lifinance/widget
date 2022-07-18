import { Avatar } from '@mui/material';
import { ChangeEvent, useLayoutEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useChain, useToken } from '../../hooks';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { fitInputText, formatAmount } from '../../utils';
import { CardContainer, CardTitle } from '../Card';
import { FormPriceHelperText } from './FormPriceHelperText';
import {
  FormControl,
  Input,
  maxInputFontSize,
  minInputFontSize,
} from './SwapInput.style';
import { SwapInputAdornment } from './SwapInputAdornment';

export const SwapInput: React.FC<SwapFormTypeProps> = ({ formType }) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const ref = useRef<HTMLInputElement>(null);

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

  useLayoutEffect(() => {
    fitInputText(
      maxInputFontSize,
      minInputFontSize,
      ref.current as HTMLElement,
    );
  }, [amount]);

  return (
    <CardContainer>
      <CardTitle>{t('swap.amount')}</CardTitle>
      <FormControl fullWidth>
        <Input
          inputRef={ref}
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
        <FormPriceHelperText selected={isSelected} formType={formType} />
      </FormControl>
    </CardContainer>
  );
};
