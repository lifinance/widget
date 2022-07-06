import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { FormControl, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useSetSettings, useSettings } from '../../stores';

export const GasPriceSelect = () => {
  const { t } = useTranslation();
  const [setValue] = useSetSettings();
  const { gasPrice } = useSettings(['gasPrice']);

  return (
    <CardContainer flex={1}>
      <CardTitle>{t(`settings.gasPrice.title`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          MenuProps={{ elevation: 2 }}
          value={gasPrice}
          onChange={(event) =>
            setValue('gasPrice', event.target.value as string)
          }
          IconComponent={KeyboardArrowDownIcon}
          dense
        >
          <MenuItem value="slow">{t(`settings.gasPrice.slow`)}</MenuItem>
          <MenuItem value="normal">{t(`settings.gasPrice.normal`)}</MenuItem>
          <MenuItem value="fast">{t(`settings.gasPrice.fast`)}</MenuItem>
        </Select>
      </FormControl>
    </CardContainer>
  );
};
