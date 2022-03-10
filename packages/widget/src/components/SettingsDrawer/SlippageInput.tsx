import { formatSlippage } from '@lifinance/widget/utils/format';
import { FormControl, InputAdornment } from '@mui/material';
import { ChangeEvent, useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { Input } from '../Input';

export const SlippageInput = () => {
  const { t } = useTranslation();
  const { register, setValue } = useFormContext();
  const value = useWatch({
    name: SwapFormKey.Slippage,
  });
  const defaultValue = useRef(value);

  useEffect(() => {
    register(SwapFormKey.Slippage);
  }, [register]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setValue(
      SwapFormKey.Slippage,
      formatSlippage(value, defaultValue.current, true),
    );
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setValue(SwapFormKey.Slippage, formatSlippage(value, defaultValue.current));
  };

  return (
    <FormControl fullWidth>
      <Input
        size="small"
        placeholder={t(`settings.slippage`)}
        endAdornment={<InputAdornment position="end">%</InputAdornment>}
        autoComplete="off"
        inputProps={{
          inputMode: 'decimal',
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        name={SwapFormKey.Slippage}
      />
    </FormControl>
  );
};
