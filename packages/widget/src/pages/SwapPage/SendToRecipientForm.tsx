import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/Input';
import { Switch } from '../../components/Switch';
import { SwapFormKey } from '../../providers/SwapFormProvider';

export const SendToRecipientForm: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  const sendToRecipientChecked = useWatch({
    name: SwapFormKey.IsSendToRecipient,
  });

  return (
    <>
      <Box
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
            lineHeight="normal"
            variant="subtitle1"
            color="text.primary"
            ml={1}
          >
            {t(`swap.sendToRecipient`)}
          </Typography>
        </Box>
        <Switch {...register(SwapFormKey.IsSendToRecipient)} />
      </Box>
      {sendToRecipientChecked ? (
        <>
          <FormControl variant="standard" fullWidth>
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
                <Checkbox
                  required
                  {...register(SwapFormKey.IsAddressConfirmed)}
                />
              }
              label={t(`swap.addressConfirmation`) as string}
              componentsProps={{ typography: { variant: 'body2' } }}
            />
          </Box>
        </>
      ) : null}
    </>
  );
};
