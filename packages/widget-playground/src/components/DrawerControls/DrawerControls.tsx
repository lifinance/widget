import CloseIcon from '@mui/icons-material/Close'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import TabContext from '@mui/lab/TabContext'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useFontInitialisation } from '../../providers/FontLoaderProvider/FontLoaderProvider'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions'
import { ExpandableCardAccordion } from '../Card/ExpandableCardAccordion'
import { Tab, Tabs } from '../Tabs/Tabs.style'
import { CodeControl } from './CodeControl/CodeControl'
import { AppearanceControl } from './DesignControls/AppearanceControl'
import { ButtonRadiusControl } from './DesignControls/ButtonRaduisControl'
import { CardRadiusControl } from './DesignControls/CardRadiusControl'
import { ColorControl } from './DesignControls/ColorControls'
import { FontsControl } from './DesignControls/FontsControl/FontsControl'
import { FormValuesControl } from './DesignControls/FormValuesControls'
import { LayoutControl } from './DesignControls/LayoutControls/LayoutControl'
import { PlaygroundSettingsControl } from './DesignControls/PlaygroundSettingsControl/PlaygroundSettingsControl'
import { SkeletonControl } from './DesignControls/SkeletonControl'
import { SubvariantControl } from './DesignControls/SubvariantControl'
import { ThemeControl } from './DesignControls/ThemeControl'
import { VariantControl } from './DesignControls/VariantControl'
import { WalletManagementControl } from './DesignControls/WalletManagementControl'
import { WidgetEventControls } from './DesignControls/WidgetEventsControls'
import {
  Drawer,
  DrawerContentContainer,
  Header,
  HeaderRow,
  TabContentContainer,
  WidgetConfigControls,
  tooltipPopperZIndex,
} from './DrawerControls.style'
import { DrawerHandle } from './DrawerHandle'

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
