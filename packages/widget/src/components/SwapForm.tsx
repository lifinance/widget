import {
  HelpOutline as HelpOutlineIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  SwapVert as SwapVertIcon,
} from '@mui/icons-material';
import { Box, FormControl, MenuItem, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Select } from './Select';
import { SendToRecipientForm } from './SendToRecipientForm';
import { SwapChainButton } from './SwapChainButton';
import { SwapInput } from './SwapInput';
import {
  SwapFromInputAdornment,
  SwapToInputAdornment,
} from './SwapInputAdornment';
import { SwapStepper } from './SwapStepper';
import { Switch } from './Switch';

export const SwapForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Box>
      <Typography variant="subtitle1" color="text.secondary" mt={3}>
        {t(`swap.form.from`)}
      </Typography>
      <Box my={1}>
        <SwapChainButton
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          disabled={isSubmitting}
          disableElevation
          disableRipple
          fullWidth
        >
          MATIC on ETH
        </SwapChainButton>
        <FormControl variant="standard" disabled={isSubmitting} fullWidth>
          <SwapInput
            type="number"
            size="small"
            defaultValue={0}
            autoComplete="off"
            endAdornment={
              <SwapFromInputAdornment maxAmount={98700.3} price={1300.0} />
            }
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
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', height: 40 }}
      >
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ alignSelf: 'end' }}
        >
          {t(`swap.form.to`)}
        </Typography>
        <SwapVertIcon sx={{ alignSelf: 'center', padding: '0 16px' }} />
      </Box>
      <Box my={1}>
        <SwapChainButton
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          disabled={isSubmitting}
          disableElevation
          disableRipple
          fullWidth
        >
          MATIC on ETH
        </SwapChainButton>
        <FormControl variant="standard" fullWidth disabled={isSubmitting}>
          <SwapInput
            type="number"
            size="small"
            defaultValue={0}
            autoComplete="off"
            endAdornment={<SwapToInputAdornment price={1300.0} />}
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
      <Box
        mt={3}
        mb={2}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HelpOutlineIcon sx={{ color: 'grey.500' }} />
          <Typography
            ml={2}
            variant="subtitle1"
            color="text.primary"
            sx={{ alignSelf: 'end' }}
          >
            {t(`swap.form.sendToRecipient`)}
          </Typography>
        </Box>
        <Switch {...register('isSendToRecipient')} />
      </Box>
      <SendToRecipientForm />
      <Box
        my={2}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HelpOutlineIcon sx={{ color: 'grey.500' }} />
          <Typography
            ml={2}
            variant="subtitle1"
            color="text.primary"
            sx={{ alignSelf: 'end' }}
          >
            {t(`swap.form.routePriority.title`)}
          </Typography>
        </Box>
        <FormControl sx={{ width: '50%' }}>
          <Select
            defaultValue={1}
            inputProps={{
              'aria-label': '',
              ...register('routePriority'),
            }}
            MenuProps={{ elevation: 2 }}
          >
            <MenuItem value={1}>
              {t(`swap.form.routePriority.recommended`)}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <SwapStepper />
    </Box>
  );
};
