import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined'
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import { Divider } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useState } from 'react'
import { useFontInitialisation } from '../../providers/FontLoaderProvider/FontLoaderProvider.js'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { ThemeControl } from './DesignControls/ThemeControl.js'
import { DeveloperControlsDetailView } from './DeveloperControlsDetailView.js'
import {
  Drawer,
  NavContent,
  SidebarContainer,
  SidebarDivider,
  SidebarSlidePanel,
  type SidebarView,
  SidebarViewTrack,
} from './DrawerControls.style.js'
import { DrawerHandle } from './DrawerHandle.js'
import { HeightDetailView } from './HeightDetailView.js'
import { ModeDetailView } from './ModeDetailView.js'
import { NavListItem } from './NavListItem.js'
import { SidebarFooter } from './SidebarFooter.js'
import { SidebarHeader } from './SidebarHeader.js'
import { ThemeEditDetailView } from './ThemeEditDetailView.js'
import { VariantDetailView } from './VariantDetailView.js'
import { WalletManagementDetailView } from './WalletManagementDetailView.js'

export const DrawerControls = (): JSX.Element => {
  const { isDrawerOpen, drawerWidth } = useDrawerToolValues()
  const { setDrawerOpen } = useEditToolsActions()
  const { resetConfig } = useConfigActions()
  const { resetEditTools } = useEditToolsActions()
  const [activeView, setActiveView] = useState<SidebarView>('nav')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useFontInitialisation()

  const handleReset = useCallback((): void => {
    resetConfig()
    resetEditTools()
  }, [resetConfig, resetEditTools])

  const handleToggleDrawer = useCallback((): void => {
    setDrawerOpen(!isDrawerOpen)
  }, [isDrawerOpen, setDrawerOpen])

  const handleNavigateBack = useCallback((): void => {
    setActiveView('nav')
  }, [])

  const handleToggleItem = useCallback(
    (item: string): void => {
      setExpandedItem(expandedItem === item ? null : item)
    },
    [expandedItem]
  )

  return (
    <>
      <DrawerHandle />
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        drawerWidth={drawerWidth}
      >
        <SidebarContainer drawerWidth={drawerWidth}>
          <SidebarViewTrack activeView={activeView}>
            <SidebarSlidePanel>
              <SidebarHeader
                onReset={handleReset}
                onToggleDrawer={handleToggleDrawer}
              />
              <NavContent>
                <NavListItem
                  icon={<TableRowsOutlinedIcon />}
                  label="Mode"
                  onClick={() => setActiveView('mode')}
                />
                <NavListItem
                  icon={<ViewSidebarOutlinedIcon />}
                  label="Variant"
                  onClick={() => setActiveView('variant')}
                />
                <NavListItem
                  icon={<HeightOutlinedIcon />}
                  label="Height"
                  onClick={() => setActiveView('height')}
                />
                <NavListItem
                  icon={<AccountBalanceWalletOutlinedIcon />}
                  label="Wallet management"
                  onClick={() => setActiveView('wallet')}
                />
                <SidebarDivider>
                  <Divider sx={{ width: '100%' }} />
                </SidebarDivider>
                <NavListItem
                  icon={<DataObjectOutlinedIcon />}
                  label="Developer controls"
                  onClick={() => setActiveView('developer')}
                />
                <SidebarDivider>
                  <Divider sx={{ width: '100%' }} />
                </SidebarDivider>
                <NavListItem
                  icon={<PaletteOutlinedIcon />}
                  label="Theme"
                  expandable
                  expanded={expandedItem === 'theme'}
                  onToggle={() => handleToggleItem('theme')}
                >
                  <ThemeControl
                    onOpenEditTheme={() => setActiveView('themeEdit')}
                  />
                </NavListItem>
              </NavContent>
              <SidebarFooter />
            </SidebarSlidePanel>
            <SidebarSlidePanel>
              {activeView === 'mode' ? (
                <ModeDetailView
                  onBack={handleNavigateBack}
                  onReset={handleReset}
                />
              ) : activeView === 'variant' ? (
                <VariantDetailView
                  onBack={handleNavigateBack}
                  onReset={handleReset}
                />
              ) : activeView === 'height' ? (
                <HeightDetailView
                  onBack={handleNavigateBack}
                  onReset={handleReset}
                />
              ) : activeView === 'wallet' ? (
                <WalletManagementDetailView
                  onBack={handleNavigateBack}
                  onReset={handleReset}
                />
              ) : activeView === 'developer' ? (
                <DeveloperControlsDetailView
                  onBack={handleNavigateBack}
                  onReset={handleReset}
                />
              ) : activeView === 'themeEdit' ? (
                <ThemeEditDetailView
                  onBack={handleNavigateBack}
                  onReset={handleReset}
                />
              ) : null}
            </SidebarSlidePanel>
          </SidebarViewTrack>
        </SidebarContainer>
      </Drawer>
    </>
  )
}
