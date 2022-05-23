import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Box, Chip, FormControl, MenuItem, Skeleton } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useBridges } from '../../hooks';
import { SwapFormKey } from '../../providers/SwapFormProvider';

export const EnabledBridgesSelect: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const bridges = useBridges();

  return bridges.length ? (
    <CardContainer>
      <CardTitle>{t(`settings.enabledBridges`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          multiple
          placeholder={t(`settings.selectEnabledBridges`)}
          defaultValue={bridges}
          MenuProps={{ elevation: 2 }}
          IconComponent={KeyboardArrowDownIcon}
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
        </Select>
      </FormControl>
    </CardContainer>
  ) : (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={134}
      sx={{ borderRadius: 2 }}
    />
  );
};
