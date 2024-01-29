import { TabContentContainer } from './DrawerControls.styles';
import { ExpandableCardAccordion, ExpandableCard } from '../ExpandableCard';
import { TabPanelProps } from '@mui/lab/TabPanel/TabPanel';
import { AppearanceControl } from '@/app/components/AppearanceControl';

export const DesignControls = (props: TabPanelProps) => {
  return (
    <TabContentContainer {...props}>
      <ExpandableCardAccordion>
        <AppearanceControl />
      </ExpandableCardAccordion>
    </TabContentContainer>
  );
};
