import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { Box, FormControl, MenuItem, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { Select } from '../Select';

export const RoutePrioritySelect: React.FC<{ fullWidth?: boolean }> = ({
  fullWidth,
}) => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <Box
      sx={{
        display: fullWidth ? 'block' : 'flex',
        justifyContent: fullWidth ? 'unset' : 'space-between',
        alignItems: fullWidth ? 'unset' : 'center',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center' }}
        mb={fullWidth ? 1 : 0}
      >
        <HelpOutlineIcon sx={{ color: 'grey.500' }} />
        <Typography
          lineHeight="normal"
          variant="subtitle1"
          color="text.secondary"
          ml={1}
        >
          {t(`settings.routePriority.title`)}
        </Typography>
      </Box>
      <FormControl sx={{ width: fullWidth ? '100%' : '50%' }} fullWidth>
        <Select
          defaultValue={1}
          MenuProps={{ elevation: 2 }}
          inputProps={{ ...register(SwapFormKey.RoutePriority) }}
        >
          <MenuItem value={1}>
            {t(`settings.routePriority.recommended`)}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
