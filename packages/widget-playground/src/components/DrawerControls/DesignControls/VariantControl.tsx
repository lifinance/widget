import type { WidgetVariant } from '@lifi/widget';
import type { SyntheticEvent } from 'react';
import { useConfigActions, useConfigVariant } from '../../../store';
import { CardValue, ExpandableCard } from '../../Card';
import { Tab, Tabs } from '../../Tabs';

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
        <Tab label="Compact" value={'compact'} disableRipple />
        <Tab label="Wide" value={'wide'} disableRipple />
        <Tab label="Drawer" value={'drawer'} disableRipple />
      </Tabs>
    </ExpandableCard>
  );
};
