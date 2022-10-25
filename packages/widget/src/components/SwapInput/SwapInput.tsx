import type { ChangeEvent } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useChain, useToken } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper, useWidgetConfig } from '../../providers';
import { DisabledUI } from '../../types';
import { fitInputText, formatAmount } from '../../utils';
import { Card, CardTitle } from '../Card';
import { TokenAvatar } from '../TokenAvatar';
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
  const { disabledUI } = useWidgetConfig();
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
    const formattedAmount = formatAmount(value, true);
    setValue(amountKey, formattedAmount, {
      shouldTouch: true,
    });
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const formattedAmount = formatAmount(value);
    setValue(amountKey, formattedAmount);
  };

  useLayoutEffect(() => {
    fitInputText(
      maxInputFontSize,
      minInputFontSize,
      ref.current as HTMLElement,
    );
  }, [amount]);

  const disabled = disabledUI?.includes(DisabledUI.FromAmount);

  return (
    <Card>
      <CardTitle>{t('swap.fromAmount')}</CardTitle>
      <FormControl fullWidth>
        <Input
          inputRef={ref}
          size="small"
          autoComplete="off"
          placeholder="0"
          startAdornment={
            isSelected ? (
              <TokenAvatar token={token} sx={{ marginLeft: 2 }} />
            ) : null
          }
          endAdornment={
            !disabled ? <SwapInputAdornment formType={formType} /> : undefined
          }
          inputProps={{
            inputMode: 'decimal',
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={amount}
          name={amountKey}
          disabled={disabled}
          required
        />
        <FormPriceHelperText selected={isSelected} formType={formType} />
      </FormControl>
    </Card>
  );
};
