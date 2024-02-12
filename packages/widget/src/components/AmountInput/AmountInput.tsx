import type { Token } from '@lifi/sdk';
import type { BoxProps } from '@mui/material';
import type { ChangeEvent, ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToken } from '../../hooks/useToken.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { FormKeyHelper, type FormTypeProps } from '../../stores/form/types.js';
import { useFieldController } from '../../stores/form/useFieldController.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { DisabledUI } from '../../types/widget.js';
import { formatInputAmount } from '../../utils/format.js';
import { fitInputText } from '../../utils/input.js';
import { Card } from '../Card/Card.js';
import { CardTitle } from '../Card/CardTitle.js';
import {
  FormContainer,
  FormControl,
  Input,
  maxInputFontSize,
  minInputFontSize,
} from './AmountInput.style.js';
import { AmountInputEndAdornment } from './AmountInputEndAdornment.js';
import { AmountInputStartAdornment } from './AmountInputStartAdornment.js';
import { PriceFormHelperText } from './PriceFormHelperText.js';

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
    <AmountInputBase
      formType={formType}
      token={token}
      endAdornment={
        !disabled ? <AmountInputEndAdornment formType={formType} /> : undefined
      }
      bottomAdornment={<PriceFormHelperText formType={formType} />}
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
    <Card {...props}>
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
    </Card>
  );
};
