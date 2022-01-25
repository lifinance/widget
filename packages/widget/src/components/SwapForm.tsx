import { Box, FormControl, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { alpha, styled } from '@mui/material/styles';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const SwapInput = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: 4,
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#2b2b2b',
  // border: '1px solid #ced4da',
  // fontSize: 16,
  // width: 'auto',
  // padding: '10px 12px',
  transition: theme.transitions.create([
    'border-color',
    'background-color',
    'box-shadow',
  ]),
  [`&.${outlinedInputClasses.focused}`]: {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
}));

export const SwapForm: React.FC = () => {
  const { register, reset, handleSubmit, getValues, formState: { isSubmitting } } = useFormContext();
  const { t } = useTranslation();

  return (
    <Box>
      <Typography
        variant="subtitle1"
        color="text.secondary"
      >
        {t(`swap.form.from`)}
      </Typography>
      <FormControl variant="standard" margin="dense" fullWidth>
        <SwapInput
          // type="number"
          size="small"
          // {...register('fromAmount', { required: true })}
          disabled={isSubmitting}
          endAdornment={<InputAdornment position="end">$</InputAdornment>}
          aria-describedby=""
          inputProps={{
            'aria-label': '',
            inputMode: 'numeric',
            ...register('fromAmount', { required: true, min: 0, valueAsNumber: true }),
          }}
          required
        />
        {/* <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText> */}
      </FormControl>
      <Typography
        variant="subtitle1"
        color="text.secondary"
      >
        {t(`swap.form.to`)}
      </Typography>
    </Box>
  );
};
