import { FormControl, InputAdornment } from '@mui/material';
import { ChangeEvent, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { Input } from '../../components/Input';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { formatSlippage } from '../../utils/format';

export const SlippageInput = () => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const value = useWatch({
    name: SwapFormKey.Slippage,
  });
  const defaultValue = useRef(value);

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
    <CardContainer>
      <CardTitle>{t(`settings.slippage`)}</CardTitle>
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
    </CardContainer>
  );
};
