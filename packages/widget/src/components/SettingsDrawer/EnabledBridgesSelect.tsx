import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { Box, FormControl, MenuItem, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { Select } from '../Select';

export const EnabledBridgesSelect: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <Box mt={3}>
      <Box sx={{ display: 'flex', alignItems: 'center' }} mb={1}>
        <HelpOutlineIcon sx={{ color: 'grey.500' }} />
        <Typography
          variant="subtitle1"
          color="text.secondary"
          lineHeight="normal"
          ml={1}
        >
          {t(`settings.enabledBridges`)}
        </Typography>
      </Box>
      <FormControl fullWidth>
        <Select
          defaultValue={1}
          MenuProps={{ elevation: 2 }}
          inputProps={{ ...register(SwapFormKey.EnabledBridges) }}
        >
          <MenuItem value={1}>{t(`swap.routePriority.recommended`)}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
