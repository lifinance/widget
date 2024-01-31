import { useState } from 'react';
import { Tabs, Tab } from '../Tabs';
import TabContext from '@mui/lab/TabContext';
import {
  Drawer,
  DrawerContentContainer,
  TabContentContainer,
} from './DrawerControls.styles';
import { ExpandableCardAccordion } from '../ExpandableCard';
import {
  AppearanceControl,
  ButtonRadiusControl,
  CardRadiusControl,
  SubvariantControl,
  VariantControl,
  ColorControl,
} from './DesignControls';

interface DrawerControlsProps {
  open: boolean;
}

export const DrawerControls = ({ open }: DrawerControlsProps) => {
  const [controlsTabsState, setControlsTabsState] = useState<'design' | 'code'>(
    'design',
  );

  return (
    <Drawer variant="persistent" anchor="left" open={open}>
      <DrawerContentContainer>
        <Tabs
          value={controlsTabsState}
          aria-label="tabs"
          indicatorColor="primary"
          onChange={(_, value) => setControlsTabsState(value)}
        >
          <Tab label={'Design'} value="design" disableRipple />
          <Tab label={'Code'} value="code" disableRipple />
        </Tabs>
        <TabContext value={controlsTabsState}>
          <TabContentContainer value="design">
            <ExpandableCardAccordion>
              <VariantControl />
              <SubvariantControl />
              <AppearanceControl />
              <CardRadiusControl />
              <ButtonRadiusControl />
              <ColorControl />
            </ExpandableCardAccordion>
          </TabContentContainer>
          <TabContentContainer value="code">
            <p>TODO: code controls</p>
          </TabContentContainer>
        </TabContext>
      </DrawerContentContainer>
    </Drawer>
  );
};
