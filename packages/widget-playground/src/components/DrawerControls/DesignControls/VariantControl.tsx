import type { SyntheticEvent } from 'react';
import type { WidgetVariant } from '@lifi/widget';
import { useConfigActions, useConfigVariant } from '../../../store';
import { Tab, Tabs } from '../../Tabs';
import { CardValue, ExpandableCard } from '../../Card';

export const VariantControl = () => {
  const { variant } = useConfigVariant();
  const { setVariant } = useConfigActions();
  const handleVariantChange = (_: SyntheticEvent, value: WidgetVariant) => {
    setVariant(value);
  };

  return (
    <ExpandableCard
      title={'Variant'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>{variant}</CardValue>
      }
    >
      <Tabs
        value={variant}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleVariantChange}
        sx={{ mt: 0.5 }}
        orientation="vertical"
      >
        <Tab label="Default" value={'default'} disableRipple />
        <Tab label="Expandable" value={'expandable'} disableRipple />
        <Tab label="Drawer" value={'drawer'} disableRipple />
      </Tabs>
    </ExpandableCard>
  );
};
