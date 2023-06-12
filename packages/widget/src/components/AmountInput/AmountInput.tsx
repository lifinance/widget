import type { Token } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import type { ChangeEvent, ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useController, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToken } from '../../hooks';
import type { FormTypeProps } from '../../providers';
import { FormKeyHelper, useWidgetConfig } from '../../providers';
import { DisabledUI } from '../../types';
import { fitInputText, formatInputAmount } from '../../utils';
import { Card, CardTitle } from '../Card';
import {
  FormControl,
  Input,
  maxInputFontSize,
  minInputFontSize,
} from './AmountInput.style';
import { AmountInputEndAdornment } from './AmountInputEndAdornment';
import { AmountInputStartAdornment } from './AmountInputStartAdornment';
import { FormPriceHelperText } from './FormPriceHelperText';

export const AmountInput: React.FC<FormTypeProps & BoxProps> = ({
  formType,
  ...props
}) => {
  const { disabledUI } = useWidgetConfig();
  const [chainId, tokenAddress] = useWatch({
    name: [
      FormKeyHelper.getChainKey(formType),
      FormKeyHelper.getTokenKey(formType),
    ],
  });
  const { token } = useToken(chainId, tokenAddress);
  const disabled = disabledUI?.includes(DisabledUI.FromAmount);
  return (
    <AmountInputBase
      formType={formType}
      token={token}
      startAdornment={<AmountInputStartAdornment formType={formType} />}
      endAdornment={
        !disabled ? <AmountInputEndAdornment formType={formType} /> : undefined
      }
      bottomAdornment={<FormPriceHelperText formType={formType} />}
      disabled={disabled}
      {...props}
    />
  );
};

export const AmountInputBase: React.FC<
  FormTypeProps &
    BoxProps & {
      token?: Token;
      startAdornment?: ReactNode;
      endAdornment?: ReactNode;
      bottomAdornment?: ReactNode;
      disabled?: boolean;
    }
> = ({
  formType,
  token,
  startAdornment,
  endAdornment,
  bottomAdornment,
  disabled,
  ...props
}) => {
  const { t } = useTranslation();
  const amountKey = FormKeyHelper.getAmountKey(formType);
  const {
    field: { onChange, onBlur, value },
  } = useController({
    name: amountKey,
  });
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const formattedAmount = formatInputAmount(value, token?.decimals, true);
    onChange(formattedAmount);
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const formattedAmount = formatInputAmount(value, token?.decimals);
    onChange(formattedAmount);
    onBlur();
  };

  useLayoutEffect(() => {
    if (ref.current) {
      fitInputText(maxInputFontSize, minInputFontSize, ref.current);
    }
  }, [value, ref]);

  return (
    <Card {...props}>
      <CardTitle>{t('main.fromAmount')}</CardTitle>
      <FormControl fullWidth>
        <Input
          inputRef={ref}
          size="small"
          autoComplete="off"
          placeholder="0"
          startAdornment={startAdornment}
          endAdornment={endAdornment}
          inputProps={{
            inputMode: 'decimal',
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          name={amountKey}
          disabled={disabled}
          required
        />
        {bottomAdornment}
      </FormControl>
    </Card>
  );
};
