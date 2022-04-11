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
import { useExchanges } from '../../hooks/useExchanges';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { MultiSelect } from '../Select';

export const EnabledExchangesSelect: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const exchanges = useExchanges();

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
          {t(`settings.enabledExchanges`)}
        </Typography>
      </Box>
      {exchanges.length ? (
        <FormControl fullWidth>
          <MultiSelect
            multiple
            placeholder={t(`settings.selectEnabledExchanges`)}
            defaultValue={exchanges}
            MenuProps={{ elevation: 2 }}
            inputProps={{ ...register(SwapFormKey.EnabledExchanges) }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {exchanges.map((exchange) => (
              <MenuItem key={exchange} value={exchange}>
                {exchange}
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
