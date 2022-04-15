import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { Box, FormControl, InputAdornment, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/Input';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { formatSlippage } from '../../utils/format';

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
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }} mb={1}>
        <HelpOutlineIcon sx={{ color: 'grey.500', paddingRight: 1 }} />
        <Typography
          variant="subtitle1"
          color="text.secondary"
          lineHeight="normal"
        >
          {t(`settings.slippage`)}
        </Typography>
      </Box>
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
    </>
  );
};
