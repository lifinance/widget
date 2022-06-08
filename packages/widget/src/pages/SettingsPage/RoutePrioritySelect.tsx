import { Orders } from '@lifinance/sdk';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { FormControl, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import {
  formDefaultValues,
  SwapFormKey,
} from '../../providers/SwapFormProvider';

export const RoutePrioritySelect: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <CardContainer>
      <CardTitle>{t(`settings.routePriority`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          defaultValue={formDefaultValues.routePriority}
          MenuProps={{ elevation: 2 }}
          inputProps={{ ...register(SwapFormKey.RoutePriority) }}
          IconComponent={KeyboardArrowDownIcon}
          dense
        >
          {Orders.map((order) => (
            <MenuItem key={order} value={order}>
              {t(`swap.tags.${order.toLowerCase()}` as any)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </CardContainer>
  );
};
