import { Box, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../providers/SwapFormProvider';
import { Input } from './Input';

export const SendToRecipientForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    formState: { isSubmitting },
  } = useFormContext();

  if (!watch(SwapFormKey.IsSendToRecipient)) {
    return null;
  }

  return (
    <Box>
      <FormControl variant="standard" fullWidth disabled={isSubmitting}>
        <Input
          size="small"
          placeholder={t(`swap.recipientsAddress`, { chain: 'ETH' })}
          required
          inputProps={{ ...register(SwapFormKey.RecipientsAddress) }}
        />
      </FormControl>
      <Box mt={0.5} mb={1}>
        <FormControlLabel
          control={
            <Checkbox required {...register(SwapFormKey.IsAddressConfirmed)} />
          }
          label={t(`swap.correctnessConfirmation`) as string}
          disabled={isSubmitting}
          componentsProps={{ typography: { variant: 'body2' } }}
        />
      </Box>
    </Box>
  );
};
