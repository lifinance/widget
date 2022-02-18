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
    const parsedValue = parseFloat(value);
    setValue(
      SwapFormKey.Slippage,
      `${
        isNaN(parsedValue)
          ? defaultValue.current
          : parsedValue > 100
          ? 100
          : parsedValue < 0
          ? Math.abs(parsedValue)
          : value
      }`,
    );
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    const parsedValue = parseFloat(value);
    setValue(
      SwapFormKey.Slippage,
      `${
        isNaN(parsedValue)
          ? defaultValue.current
          : parsedValue > 100
          ? 100
          : parsedValue < 0
          ? Math.abs(parsedValue)
          : parsedValue
      }`,
    );
  };

  return (
    <FormControl fullWidth>
      <Input
        size="small"
        placeholder={t(`settings.slippage`)}
        endAdornment={<InputAdornment position="end">%</InputAdornment>}
        autoComplete="off"
        inputProps={{
          type: 'number',
          inputMode: 'numeric',
          min: 0,
          step: 0.1,
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        name={SwapFormKey.Slippage}
      />
    </FormControl>
  );
};
