import CloseIcon from '@mui/icons-material/Close'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import TabContext from '@mui/lab/TabContext'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useFontInitialisation } from '../../providers/FontLoaderProvider/FontLoaderProvider.js'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { ExpandableCardAccordion } from '../Card/ExpandableCardAccordion.js'
import { Tab, Tabs } from '../Tabs/Tabs.style.js'
import { CodeControl } from './CodeControl/CodeControl.js'
import { AppearanceControl } from './DesignControls/AppearanceControl.js'
import { ButtonRadiusControl } from './DesignControls/ButtonRaduisControl.js'
import { CardRadiusControl } from './DesignControls/CardRadiusControl.js'
import { ColorControl } from './DesignControls/ColorControls.js'
import { FontsControl } from './DesignControls/FontsControl/FontsControl.js'
import { FormValuesControl } from './DesignControls/FormValuesControls.js'
import { LayoutControl } from './DesignControls/LayoutControls/LayoutControl.js'
import { PlaygroundSettingsControl } from './DesignControls/PlaygroundSettingsControl/PlaygroundSettingsControl.js'
import { SkeletonControl } from './DesignControls/SkeletonControl.js'
import { SubvariantControl } from './DesignControls/SubvariantControl.js'
import { ThemeControl } from './DesignControls/ThemeControl.js'
import { VariantControl } from './DesignControls/VariantControl.js'
import { WalletManagementControl } from './DesignControls/WalletManagementControl.js'
import { WidgetEventControls } from './DesignControls/WidgetEventsControls.js'
import {
  Drawer,
  DrawerContentContainer,
  Header,
  HeaderRow,
  TabContentContainer,
  tooltipPopperZIndex,
  WidgetConfigControls,
} from './DrawerControls.style.js'
import { DrawerHandle } from './DrawerHandle.js'

export const DrawerControls = () => {
  const { isDrawerOpen, drawerWidth, visibleControls } = useDrawerToolValues()
  const { setDrawerOpen, setVisibleControls } = useEditToolsActions()
  const { resetConfig } = useConfigActions()
  const { resetEditTools } = useEditToolsActions()

  useFontInitialisation()

  const handleReset = () => {
    resetConfig()
    resetEditTools()
  }

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
                slotProps={{
                  popper: { style: { zIndex: tooltipPopperZIndex } },
                }}
                arrow
              >
                <IconButton onClick={handleReset}>
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Close tools"
                slotProps={{
                  popper: { style: { zIndex: tooltipPopperZIndex } },
                }}
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
            <TabContentContainer
              value="design"
              sx={{ justifyContent: 'space-between' }}
            >
              <ExpandableCardAccordion>
                <WidgetConfigControls>
                  <VariantControl />
                  <SubvariantControl />
                  <AppearanceControl />
                  <ThemeControl />
                  <ColorControl />
                  <FontsControl />
                  <CardRadiusControl />
                  <ButtonRadiusControl />
                  <FormValuesControl />
                  <WidgetEventControls />
                  <WalletManagementControl />
                  <SkeletonControl />
                  <LayoutControl />
                </WidgetConfigControls>
                <PlaygroundSettingsControl />
              </ExpandableCardAccordion>
            </TabContentContainer>
            <TabContentContainer value="code">
              <CodeControl />
            </TabContentContainer>
          </TabContext>
        </DrawerContentContainer>
      </Drawer>
    </>
  )
}
