import { TabPanelProps } from '@mui/lab/TabPanel/TabPanel';
import { TabContentContainer } from '../DrawerControls.styles';
import { ExpandableCardAccordion } from '../../ExpandableCard';
import { AppearanceControl } from './AppearanceControl';
import { VariantControl } from './VariantControl';
import { SubvariantControl } from './SubvariantControl';
import { CardRadiusControl } from './CardRadiusControl';
import { ButtonRadiusControl } from './ButtonRaduisControl';

export const DesignControls = (props: TabPanelProps) => {
  return (
    <TabContentContainer {...props}>
      <ExpandableCardAccordion>
        <VariantControl />
        <SubvariantControl />
        <AppearanceControl />
        <CardRadiusControl />
        <ButtonRadiusControl />
      </ExpandableCardAccordion>
    </TabContentContainer>
  );
};
