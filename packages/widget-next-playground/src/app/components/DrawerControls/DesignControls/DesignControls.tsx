import { TabContentContainer } from '../DrawerControls.styles';
import { ExpandableCardAccordion } from '../../ExpandableCard';
import { TabPanelProps } from '@mui/lab/TabPanel/TabPanel';
import { AppearanceControl } from './AppearanceControl';
import { VariantControl } from './VariantControl';
import { SubvariantControl } from './SubvariantControl';
import { CardRadiusControl } from '@/app/components/DrawerControls/DesignControls/CardRadiusControl';

export const DesignControls = (props: TabPanelProps) => {
  return (
    <TabContentContainer {...props}>
      <ExpandableCardAccordion>
        <VariantControl />
        <SubvariantControl />
        <AppearanceControl />
        <CardRadiusControl />
      </ExpandableCardAccordion>
    </TabContentContainer>
  );
};
