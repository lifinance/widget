import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Box, Chip, FormControl, MenuItem, Skeleton } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useExchanges } from '../../hooks';
import { SwapFormKey } from '../../providers/SwapFormProvider';

export const EnabledExchangesSelect: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const exchanges = useExchanges();

  return exchanges.length ? (
    <CardContainer>
      <CardTitle>{t(`settings.enabledExchanges`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          multiple
          placeholder={t(`settings.selectEnabledExchanges`)}
          defaultValue={exchanges}
          MenuProps={{ elevation: 2 }}
          IconComponent={KeyboardArrowDownIcon}
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
        </Select>
      </FormControl>
    </CardContainer>
  ) : (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={206}
      sx={{ borderRadius: 2 }}
    />
  );
};
