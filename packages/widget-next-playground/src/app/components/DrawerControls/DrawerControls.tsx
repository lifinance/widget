import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import CloseIcon from '@mui/icons-material/Close';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { IconButton, Tooltip } from '@mui/material';
import { Tabs, Tab } from '../Tabs';
import {
  Drawer,
  DrawerContentContainer,
  Header,
  HeaderRow,
  Subheader,
  TabContentContainer,
  tooltipPopperZIndex,
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
import { LifiLogo } from '../LifiLogo';

interface DrawerControlsProps {
  open: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export const DrawerControls = ({
  open,
  setDrawerOpen,
}: DrawerControlsProps) => {
  const [controlsTabsState, setControlsTabsState] = useState<'design' | 'code'>(
    'design',
  );

  return (
    <Drawer variant="persistent" anchor="left" open={open}>
      <DrawerContentContainer>
        <HeaderRow>
          <Header>
            <LifiLogo />
          </Header>
          <Tooltip
            title="Close tools"
            PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
            arrow
          >
            <IconButton onClick={() => setDrawerOpen(!open)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </HeaderRow>
        <Subheader>Widget</Subheader>
        <Tabs
          value={controlsTabsState}
          aria-label="tabs"
          indicatorColor="primary"
          onChange={(_, value) => setControlsTabsState(value)}
        >
          <Tab
            icon={<DesignServicesIcon />}
            iconPosition="start"
            label={'Design'}
            value="design"
            disableRipple
          />
          <Tab
            icon={<IntegrationInstructionsIcon />}
            iconPosition="start"
            label={'Code'}
            value="code"
            disableRipple
            disabled
          />
        </Tabs>
        <TabContext value={controlsTabsState}>
          <TabContentContainer value="design">
            <ExpandableCardAccordion>
              <VariantControl />
              <SubvariantControl />
              <AppearanceControl />
              <ColorControl />
              <FontsControl />
              <CardRadiusControl />
              <ButtonRadiusControl />
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
