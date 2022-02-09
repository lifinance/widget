import { Box, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from './Input';

export const SendToRecipientForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext();
  const sendToRecipientChecked = useWatch({
    name: 'isSendToRecipient',
    defaultValue: false,
  });

  if (!sendToRecipientChecked) {
    return null;
  }

  return (
    <Box>
      <FormControl variant="standard" fullWidth disabled={isSubmitting}>
        <Input
          size="small"
          placeholder={t(`swap.recipientsAddress`, { chain: 'ETH' })}
          inputProps={{ ...register('recipientsAddress') }}
          required
        />
      </FormControl>
      <Box mt={0.5} mb={1}>
        <FormControlLabel
          control={<Checkbox required {...register('isAddressConfirmed')} />}
          label={t(`swap.correctnessConfirmation`) as string}
          disabled={isSubmitting}
          componentsProps={{ typography: { variant: 'body2' } }}
        />
      </Box>
    </Box>
  );
};
