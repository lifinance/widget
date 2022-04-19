import { FormControl, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
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
  const { setValue } = useFormContext();
  const amountKey = SwapFormKeyHelper.getAmountKey(formType);
  const value = useWatch({
    name: amountKey,
  });

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
    <FormControl fullWidth>
      <Typography variant="body2" fontWeight="bold" px={2}>
        {t('swap.amount')}
      </Typography>
      <Input
        size="small"
        autoComplete="off"
        placeholder="0"
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
