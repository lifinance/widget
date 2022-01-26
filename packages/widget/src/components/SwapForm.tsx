import { KeyboardArrowDown as KeyboardArrowDownIcon, SwapVert as SwapVertIcon } from '@mui/icons-material';
import { Box, FormControl, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapChainButton } from './SwapChainButton';
import { SwapInput } from './SwapInput';
import { SwapFromInputAdornment, SwapToInputAdornment } from './SwapInputAdornment';

export const SwapForm: React.FC = () => {
  const { register, reset, handleSubmit, getValues, formState: { isSubmitting } } = useFormContext();
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="subtitle1" color="text.secondary" mt={3}>
        {t(`swap.form.from`)}
      </Typography>
      <Box my={1}>
        <SwapChainButton fullWidth disableElevation disableRipple variant="outlined" endIcon={<KeyboardArrowDownIcon />}>
          MATIC on ETH
        </SwapChainButton>
        <FormControl variant="standard" fullWidth>
          <SwapInput
            type="number"
            size="small"
            defaultValue={0}
            disabled={isSubmitting}
            autoComplete="off"
            endAdornment={(<SwapFromInputAdornment maxAmount={98700.30} price={1300.00} />)}
            aria-describedby=""
            inputProps={{
              min: 0,
              step: 1e-18,
              'aria-label': '',
              inputMode: 'numeric',
              ...register('fromAmount', { required: true }),
            }}
            required
          />
          {/* <FormHelperText id="swap-from-helper-text">Text</FormHelperText> */}
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', height: 40 }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ alignSelf: 'end' }}>
          {t(`swap.form.to`)}
        </Typography>
        <SwapVertIcon sx={{ alignSelf: 'center', padding: '0 16px' }} />
      </Box>
      <Box my={1}>
        <SwapChainButton fullWidth disableElevation disableRipple variant="outlined" endIcon={<KeyboardArrowDownIcon />}>
          MATIC on ETH
        </SwapChainButton>
        <FormControl variant="standard" fullWidth>
          <SwapInput
            type="number"
            size="small"
            defaultValue={0}
            disabled={isSubmitting}
            autoComplete="off"
            endAdornment={(<SwapToInputAdornment price={1300.00} />)}
            aria-describedby=""
            inputProps={{
              min: 0,
              step: 1e-18,
              'aria-label': '',
              inputMode: 'numeric',
              ...register('toAmount', { required: true }),
            }}
            required
          />
          {/* <FormHelperText id="swap-to-helper-text">Text</FormHelperText> */}
        </FormControl>
      </Box>
    </Box>
  );
};
