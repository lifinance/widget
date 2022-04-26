import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { FormControl, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { SwapFormKey } from '../../providers/SwapFormProvider';

export const GasPriceSelect = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <CardContainer>
      <CardTitle>{t(`settings.gasPrice.title`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          defaultValue="normal"
          MenuProps={{ elevation: 2 }}
          inputProps={{ ...register(SwapFormKey.GasPrice) }}
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
