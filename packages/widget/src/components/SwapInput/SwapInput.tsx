import type { Token } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import type { ChangeEvent, ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useController, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToken } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper, useWidgetConfig } from '../../providers';
import { DisabledUI } from '../../types';
import { fitInputText, formatInputAmount } from '../../utils';
import { Card, CardTitle } from '../Card';
import { FormPriceHelperText } from './FormPriceHelperText';
import {
  FormControl,
  Input,
  maxInputFontSize,
  minInputFontSize,
} from './SwapInput.style';
import { SwapInputEndAdornment } from './SwapInputEndAdornment';
import { SwapInputStartAdornment } from './SwapInputStartAdornment';

export const SwapInput: React.FC<SwapFormTypeProps & BoxProps> = ({
  formType,
  ...props
}) => {
  const { disabledUI } = useWidgetConfig();
  const [chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });
  const { token } = useToken(chainId, tokenAddress);
  const disabled = disabledUI?.includes(DisabledUI.FromAmount);
  return (
    <SwapInputBase
      formType={formType}
      token={token}
      startAdornment={<SwapInputStartAdornment formType={formType} />}
      endAdornment={
        !disabled ? <SwapInputEndAdornment formType={formType} /> : undefined
      }
      bottomAdornment={<FormPriceHelperText formType={formType} />}
      disabled={disabled}
      {...props}
    />
  );
};

export const SwapInputBase: React.FC<
  SwapFormTypeProps &
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
  const amountKey = SwapFormKeyHelper.getAmountKey(formType);
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
