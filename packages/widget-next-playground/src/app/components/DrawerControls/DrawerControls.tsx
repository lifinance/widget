import { useState } from 'react';
import { Tabs, Tab } from '../Tabs';
import TabContext from '@mui/lab/TabContext';
import {
  Drawer,
  DrawerContentContainer,
  TabContentContainer,
} from './DrawerControls.style';
import { ExpandableCardAccordion } from '../Card';
import {
  AppearanceControl,
  ButtonRadiusControl,
  CardRadiusControl,
  SubvariantControl,
  VariantControl,
  ColorControl,
  FontsControl,
  WalletManagementControl,
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
          <Tab label={'Code'} value="code" disableRipple disabled />
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
              <FontsControl />
              <WalletManagementControl />
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
