import type { SyntheticEvent } from 'react';
import type { WidgetSubvariant } from '@lifi/widget';
import { useConfigActions, useConfigSubvariant } from '../../../store';
import { Tab, Tabs } from '../../Tabs';
import { CardValue, ExpandableCard } from '../../Card';

export const SubvariantControl = () => {
  const { subvariant } = useConfigSubvariant();
  const { setSubvariant } = useConfigActions();
  const handleSubvariantChange = (
    _: SyntheticEvent,
    value: WidgetSubvariant,
  ) => {
    setSubvariant(value);
  };

  return (
    <ExpandableCard
      title={'Subvariant'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>{subvariant}</CardValue>
      }
    >
      <Tabs
        value={subvariant}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleSubvariantChange}
        sx={{ mt: 0.5 }}
      >
        <Tab label="Default" value={'default'} disableRipple />
        <Tab label="Split" value={'split'} disableRipple />
        <Tab label="Refuel" value={'refuel'} disableRipple />
      </Tabs>
    </ExpandableCard>
  );
};
