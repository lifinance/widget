import { TabContentContainer } from './DrawerControls.styles';
import { ExpandableCardAccordion } from '../ExpandableCard';
import { TabPanelProps } from '@mui/lab/TabPanel/TabPanel';
import { AppearanceControl } from '../AppearanceControl';
import { VariantControl } from '../VariantControl';

export const DesignControls = (props: TabPanelProps) => {
  return (
    <TabContentContainer {...props}>
      <ExpandableCardAccordion>
        <VariantControl />
        <AppearanceControl />
      </ExpandableCardAccordion>
    </TabContentContainer>
  );
};
