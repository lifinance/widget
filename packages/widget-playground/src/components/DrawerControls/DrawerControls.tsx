import CloseIcon from '@mui/icons-material/Close';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TabContext from '@mui/lab/TabContext';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import {
  useConfigActions,
  useEditToolsActions,
  useEditToolsValues,
} from '../../store';
import { ExpandableCardAccordion } from '../Card';
import { Tab, Tabs } from '../Tabs';
import {
  AppearanceControl,
  ButtonRadiusControl,
  CardRadiusControl,
  ColorControl,
  FontsControl,
  SubvariantControl,
  VariantControl,
  WalletManagementControl,
} from './DesignControls';
import {
  Drawer,
  DrawerContentContainer,
  Header,
  HeaderRow,
  TabContentContainer,
  tooltipPopperZIndex,
} from './DrawerControls.style';

export const DrawerControls = () => {
  const [controlsTabsState, setControlsTabsState] = useState<'design' | 'code'>(
    'design',
  );
  const { isDrawerOpen } = useEditToolsValues();
  const { setDrawerOpen } = useEditToolsActions();
  const { resetConfig } = useConfigActions();

  return (
    <Drawer variant="persistent" anchor="left" open={isDrawerOpen}>
      <DrawerContentContainer>
        <HeaderRow>
          <Header>LI.FI Widget</Header>
          <Box>
            <Tooltip
              title="Reset config"
              PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
              arrow
            >
              <IconButton onClick={() => resetConfig()}>
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Close tools"
              PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
              arrow
            >
              <IconButton onClick={() => setDrawerOpen(!isDrawerOpen)}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </HeaderRow>
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
