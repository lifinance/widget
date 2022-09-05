import type { Order } from '@lifi/sdk';
import { Orders } from '@lifi/sdk';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { FormControl, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useSetSettings, useSettings } from '../../stores';

export const RoutePrioritySelect: React.FC = () => {
  const { t } = useTranslation();
  const [setValue] = useSetSettings();
  const { routePriority } = useSettings(['routePriority']);

  return (
    <Card>
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
          {Orders.map((order) => {
            const tag = t(`swap.tags.${order.toUpperCase()}` as any);
            const tagName = `${tag[0]}${tag.slice(1).toLowerCase()}`;
            return (
              <MenuItem key={order} value={order}>
                {tagName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Card>
  );
};
