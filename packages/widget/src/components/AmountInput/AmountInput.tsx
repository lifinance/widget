import type { Token } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import type { ChangeEvent, ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToken } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import type { FormTypeProps } from '../../stores';
import {
  FormKeyHelper,
  useFieldController,
  useFieldValues,
} from '../../stores';
import { DisabledUI } from '../../types';
import { fitInputText, formatInputAmount } from '../../utils';
import { Card, CardTitle } from '../Card';
import {
  FormContainer,
  FormControl,
  Input,
  maxInputFontSize,
  minInputFontSize,
} from './AmountInput.style';
import { AmountInputEndAdornment } from './AmountInputEndAdornment';
import { AmountInputStartAdornment } from './AmountInputStartAdornment';
import { PriceFormHelperText } from './PriceFormHelperText';

export const AmountInput: React.FC<FormTypeProps & BoxProps> = ({
  formType,
  ...props
}) => {
  const { disabledUI } = useWidgetConfig();

  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType),
  );

  const { token } = useToken(chainId, tokenAddress);
  const disabled = disabledUI?.includes(DisabledUI.FromAmount);

  return (
    <Card {...props}>
      <AmountInputBase
        formType={formType}
        token={token}
        endAdornment={undefined}
        bottomAdornment={<PriceFormHelperText formType={formType} />}
        disabled={disabled}
        {...props}
      />
      {!disabled ? <AmountInputEndAdornment formType={formType} /> : <></>}
    </Card>
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
  const ref = useRef<HTMLInputElement>(null);
  const amountKey = FormKeyHelper.getAmountKey(formType);
  const { onChange, onBlur, value } = useFieldController({ name: amountKey });

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
    <>
      <CardTitle>{t('main.fromAmount')}</CardTitle>
      <FormContainer>
        <AmountInputStartAdornment formType={formType} />
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
      </FormContainer>
    </>
  );
};
