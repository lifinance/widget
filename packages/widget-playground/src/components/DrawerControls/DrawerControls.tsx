import CloseIcon from '@mui/icons-material/Close';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TabContext from '@mui/lab/TabContext';
import { Box, IconButton, Tooltip } from '@mui/material';
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
import { CodeControl } from './CodeControl';
import { DrawerHandle } from './DrawerHandle';
import { useFontInitialisation } from '../../providers';

export const DrawerControls = () => {
  const { isDrawerOpen, drawerWidth, visibleControls } = useEditToolsValues();
  const { setDrawerOpen, setVisibleControls } = useEditToolsActions();
  const { resetConfig } = useConfigActions();

  useFontInitialisation();

  const handleReset = () => {
    resetConfig();
  };

  return (
    <>
      <DrawerHandle />
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        drawerWidth={drawerWidth}
      >
        <DrawerContentContainer drawerWidth={drawerWidth}>
          <HeaderRow>
            <Header>LI.FI Widget</Header>
            <Box>
              <Tooltip
                title="Reset config"
                PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
                arrow
              >
                <IconButton onClick={handleReset}>
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
          <Box sx={{ maxWidth: 344, height: 56 }}>
            <Tabs
              value={visibleControls}
              aria-label="tabs"
              indicatorColor="primary"
              onChange={(_, value) => setVisibleControls(value)}
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
              />
            </Tabs>
          </Box>
          <TabContext value={visibleControls}>
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
            <TabContentContainer
              value="code"
              sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
            >
              <CodeControl />
            </TabContentContainer>
          </TabContext>
        </DrawerContentContainer>
      </Drawer>
    </>
  );
};
