import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Skeleton,
  Typography
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBridges } from '../../hooks/useBridges';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { MultiSelect } from '../Select';

export const EnabledBridgesSelect: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const bridges = useBridges();

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
      {bridges.length ? (
        <FormControl fullWidth>
          <MultiSelect
            multiple
            placeholder={t(`settings.selectEnabledBridges`)}
            defaultValue={bridges}
            MenuProps={{ elevation: 2 }}
            inputProps={{ ...register(SwapFormKey.EnabledBridges) }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {bridges.map((bridge) => (
              <MenuItem key={bridge} value={bridge}>
                {bridge}
              </MenuItem>
            ))}
          </MultiSelect>
        </FormControl>
      ) : (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={44}
          sx={{ borderRadius: 1 }}
        />
      )}
    </Box>
  );
};
