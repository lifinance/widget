import { Button, FormControl } from '@mui/material';
import { Box } from '@mui/system';
import { ChangeEvent, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { formatAmount } from '../../utils/format';
import { SwapInputAdornment } from '../SwapInputAdornment';
import { Input } from './EmailInput.style';

const InputEndAdornment = () => {
  return <span style={{ color: 'grey' }}>@</span>;
};

export const EmailInput = () => {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();
  // const amountKey = SwapFormKeyHelper.getAmountKey(formType);
  // const value = useWatch({
  //   name: amountKey,
  // });

  // useEffect(() => {
  //   register(amountKey, { required: true });
  // }, [amountKey, register]);

  // const handleChange = (
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  // ) => {
  //   const { value } = event.target;
  //   setValue(amountKey, formatAmount(value, true));
  // };

  // const handleBlur = (
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  // ) => {
  //   const { value } = event.target;
  //   setValue(amountKey, formatAmount(value));
  // };

  return (
    <Box
      px={3}
      component="form"
      sx={{
        margin: '0 auto',
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
    >
      <FormControl disabled={isSubmitting}>
        <Input
          autoComplete="off"
          placeholder={t(`transaction.footer.emailForm.inputPlaceholder`)}
          endAdornment={<InputEndAdornment />}
          inputProps={{
            inputMode: 'email',
          }}
          // onChange={handleChange}
          // onBlur={handleBlur}
          // value={value}
          // name={amountKey}
          required
        />

        {/* <FormHelperText id="swap-from-helper-text">Text</FormHelperText> */}
      </FormControl>
      <Button size="large" variant="contained">
        {t(`transaction.footer.emailForm.submitBtn`)}
      </Button>
    </Box>
  );
};
