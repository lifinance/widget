import { FormControl } from '@mui/material';
import { ChangeEvent, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { formatAmount } from '../../utils/format';
import { SwapInputAdornment } from '../SwapInputAdornment';
import { Input } from './SwapInput.style';

export const SwapInput: React.FC<SwapFormTypeProps> = ({ formType }) => {
  const { t } = useTranslation();
  const { register, setValue } = useFormContext();
  const amountKey = SwapFormKeyHelper.getAmountKey(formType);
  const value = useWatch({
    name: amountKey,
  });

  useEffect(() => {
    register(amountKey, { required: true });
  }, [amountKey, register]);

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
    <FormControl disabled={formType === 'to'} fullWidth>
      <Input
        size="small"
        autoComplete="off"
        placeholder={formType === 'from' ? t(`swap.enterAmount`) : '0'}
        endAdornment={<SwapInputAdornment formType={formType} />}
        inputProps={{
          inputMode: 'decimal',
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        name={amountKey}
        required
      />
      {/* <FormHelperText id="swap-from-helper-text">Text</FormHelperText> */}
    </FormControl>
  );
};
