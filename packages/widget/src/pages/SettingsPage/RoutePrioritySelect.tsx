import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { FormControl, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { SwapFormKey } from '../../providers/SwapFormProvider';

export const RoutePrioritySelect: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <CardContainer>
      <CardTitle>{t(`settings.routePriority.title`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          defaultValue={1}
          MenuProps={{ elevation: 2 }}
          inputProps={{ ...register(SwapFormKey.RoutePriority) }}
          IconComponent={KeyboardArrowDownIcon}
          dense
        >
          <MenuItem value={1}>
            {t(`settings.routePriority.recommended`)}
          </MenuItem>
        </Select>
      </FormControl>
    </CardContainer>
  );
};
