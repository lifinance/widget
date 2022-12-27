import type { BoxProps } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper, useWidgetConfig } from '../../providers';
import { DisabledUI } from '../../types';
import { formatAmount } from '../../utils';
import { Card, CardTitle } from '../Card';
import { FitInputText } from './FitInputText';
import { FormPriceHelperText } from './FormPriceHelperText';
import { FormControl, Input } from './SwapInput.style';
import { SwapInputEndAdornment } from './SwapInputEndAdornment';
import { SwapInputStartAdornment } from './SwapInputStartAdornment';

export const SwapInput: React.FC<SwapFormTypeProps & BoxProps> = ({
  formType,
  ...props
}) => {
  const { t } = useTranslation();
  const amountKey = SwapFormKeyHelper.getAmountKey(formType);
  const {
    field: { onChange, onBlur, value },
  } = useController({
    name: amountKey,
  });
  const { disabledUI } = useWidgetConfig();
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const formattedAmount = formatAmount(value, true);
    onChange(formattedAmount);
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const formattedAmount = formatAmount(value);
    onChange(formattedAmount);
    onBlur();
  };

  const disabled = disabledUI?.includes(DisabledUI.FromAmount);

  return (
    <Card {...props}>
      <CardTitle>{t('swap.fromAmount')}</CardTitle>
      <FormControl fullWidth>
        <Input
          inputRef={ref}
          size="small"
          autoComplete="off"
          placeholder="0"
          startAdornment={<SwapInputStartAdornment formType={formType} />}
          endAdornment={
            !disabled ? (
              <SwapInputEndAdornment formType={formType} />
            ) : undefined
          }
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
        <FormPriceHelperText formType={formType} />
      </FormControl>
      <FitInputText ref={ref} formType={formType} />
    </Card>
  );
};
