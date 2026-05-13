import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined'
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import { Divider } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useThemeMode } from '../../hooks/useThemeMode.js'
import { useFontInitialisation } from '../../providers/FontLoaderProvider/FontLoaderProvider.js'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { DeveloperControlsDetailView } from '../DeveloperControlsDetailView/DeveloperControlsDetailView.js'
import { HeightDetailView } from '../HeightDetailView.js'
import { ModeDetailView } from '../ModeDetailView.js'
import { NavListItem } from '../NavListItem/NavListItem.js'
import { ThemeControl } from '../ThemeControl/ThemeControl.js'
import { ThemeEditDetailView } from '../ThemeEditDetailView/ThemeEditDetailView.js'
import { VariantDetailView } from '../VariantDetailView.js'
import { WalletManagementDetailView } from '../WalletManagementDetailView.js'
import {
  Drawer,
  NavContent,
  SidebarContainer,
  SidebarDivider,
  SidebarSlidePanel,
  type SidebarView,
  SidebarViewTrack,
} from './DrawerControls.style.js'
import { SidebarFooter } from './SidebarFooter.js'
import { SidebarHeader } from './SidebarHeader.js'

export const DrawerControls = (): JSX.Element => {
  const { isDrawerOpen, drawerWidth } = useDrawerToolValues()
  const { setDrawerOpen, resetEditTools } = useEditToolsActions()
  const { resetConfig } = useConfigActions()
  const { setMode } = useThemeMode()
  const [activeView, setActiveView] = useState<SidebarView>('nav')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useFontInitialisation()

  const handleResetAll = useCallback((): void => {
    resetConfig()
    resetEditTools()
    setMode('system')
  }, [resetConfig, resetEditTools, setMode])

  const isDrawerOpenRef = useRef(isDrawerOpen)
  isDrawerOpenRef.current = isDrawerOpen

  const handleToggleDrawer = useCallback((): void => {
    setDrawerOpen(!isDrawerOpenRef.current)
  }, [setDrawerOpen])

  const handleNavigateBack = useCallback((): void => {
    setActiveView('nav')
  }, [])

  const handleToggleItem = useCallback((item: string): void => {
    setExpandedItem((prev) => (prev === item ? null : item))
  }, [])

  return (
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
              onReset={handleResetAll}
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
              <ModeDetailView onBack={handleNavigateBack} />
            ) : activeView === 'variant' ? (
              <VariantDetailView onBack={handleNavigateBack} />
            ) : activeView === 'height' ? (
              <HeightDetailView onBack={handleNavigateBack} />
            ) : activeView === 'wallet' ? (
              <WalletManagementDetailView onBack={handleNavigateBack} />
            ) : activeView === 'developer' ? (
              <DeveloperControlsDetailView onBack={handleNavigateBack} />
            ) : activeView === 'themeEdit' ? (
              <ThemeEditDetailView onBack={handleNavigateBack} />
            ) : null}
          </SidebarSlidePanel>
        </SidebarViewTrack>
      </SidebarContainer>
    </Drawer>
  )
}
