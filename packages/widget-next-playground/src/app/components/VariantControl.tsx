import { Appearance, WidgetVariant } from '@lifi/widget';
import { ExpandableCard } from './ExpandableCard';
import { Tab, Tabs } from './Tabs';
import { useConfigActions, useConfigVariant } from '@/app/store';
import { CardValue } from '@/app/components/ExpandableCard/ExpandableCard.styles';

export const VariantControl = () => {
  const { variant } = useConfigVariant();
  const { setVariant } = useConfigActions();
  const handleAppearanceChange = (
    _: React.SyntheticEvent,
    value: WidgetVariant,
  ) => {
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
        onChange={handleAppearanceChange}
        sx={{ mt: 1.5 }}
        orientation="vertical"
      >
        <Tab label="Default" value={'default'} disableRipple />
        <Tab label="Expandable" value={'expandable'} disableRipple />
        <Tab label="Drawer" value={'drawer'} disableRipple />
      </Tabs>
    </ExpandableCard>
  );
};
