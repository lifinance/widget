import { Order, Orders } from '@lifinance/sdk';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { FormControl, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useSetSettings, useSettings } from '../../stores';

export const RoutePrioritySelect: React.FC = () => {
  const { t } = useTranslation();
  const [setValue] = useSetSettings();
  const { routePriority } = useSettings(['routePriority']);

  return (
    <CardContainer>
      <CardTitle>{t(`settings.routePriority`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          MenuProps={{ elevation: 2 }}
          value={routePriority}
          onChange={(event) =>
            setValue('routePriority', event.target.value as Order)
          }
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
