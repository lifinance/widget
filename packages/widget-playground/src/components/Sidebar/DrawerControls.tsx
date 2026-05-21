import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined'
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import { Divider } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useRef, useState } from 'react'
import { usePlaygroundLayoutControls } from '../../hooks/usePlaygroundLayoutControls.js'
import { useThemeMode } from '../../hooks/useThemeMode.js'
import { useFontInitialisation } from '../../providers/FontLoaderProvider/FontLoaderProvider.js'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import {
  useConfigSubvariant,
  useConfigSubvariantOptions,
  useConfigVariant,
  useConfigWalletManagement,
} from '../../store/widgetConfig/useConfigValues.js'
import { useThemeValues } from '../../store/widgetConfig/useThemeValues.js'
import { DeveloperControlsDetailView } from '../DeveloperControlsDetailView/DeveloperControlsDetailView.js'
import { HeightDetailView } from '../HeightDetailView.js'
import { ModeDetailView } from '../ModeDetailView.js'
import { NavListItem } from '../NavListItem/NavListItem.js'
import { ThemeControl } from '../ThemeControl/ThemeControl.js'
import { ThemeEditDetailView } from '../ThemeEditDetailView.js'
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

const modeLabels: Record<string, string> = {
  exchange: 'Exchange',
  split: 'Swap or Bridge',
  swap: 'Swap',
  bridge: 'Bridge',
  refuel: 'Refuel',
}

const heightLabels: Record<string, string> = {
  default: 'Default',
  'restricted-height': 'Restricted height',
  'restricted-max-height': 'Restricted max height',
  'full-height': 'Full height',
}

function getModeLabel(subvariant: string, splitOption?: string): string {
  if (subvariant === 'refuel') {
    return modeLabels.refuel
  }
  if (subvariant === 'split') {
    if (splitOption === 'swap') {
      return modeLabels.swap
    }
    if (splitOption === 'bridge') {
      return modeLabels.bridge
    }
    return modeLabels.split
  }
  return modeLabels.exchange
}

function getWalletLabel(isExternal: boolean, isPartial: boolean): string {
  if (!isExternal) {
    return 'Internal'
  }
  return isPartial ? 'Partial' : 'External'
}

export const DrawerControls = (): JSX.Element => {
  const { isDrawerOpen, drawerWidth } = useDrawerToolValues()
  const { setDrawerOpen, resetEditTools } = useEditToolsActions()
  const { resetConfig } = useConfigActions()
  const { setMode, themeMode } = useThemeMode()
  const [activeView, setActiveView] = useState<SidebarView>('nav')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const { subvariant } = useConfigSubvariant()
  const { subvariantOptions } = useConfigSubvariantOptions()
  const { variant } = useConfigVariant()
  const { selectedLayoutId } = usePlaygroundLayoutControls()
  const { isExternalWalletManagement, isPartialWalletManagement } =
    useConfigWalletManagement()
  const { selectedThemeItem } = useThemeValues()

  const themeLabel = (() => {
    if (!selectedThemeItem) {
      return undefined
    }
    const displayName = selectedThemeItem.name.replace(/\s+Light$/i, '')
    const colorSchemeKeys = Object.keys(
      selectedThemeItem.theme.colorSchemes ?? {}
    )
    const hasBothModes =
      colorSchemeKeys.includes('light') && colorSchemeKeys.includes('dark')
    if (hasBothModes) {
      return `${displayName} (${themeMode === 'dark' ? 'Dark' : 'Light'})`
    }
    return displayName
  })()

  const modeValue = getModeLabel(
    subvariant,
    subvariantOptions?.split as string | undefined
  )
  const variantValue =
    variant === 'compact' ? 'Compact' : variant === 'wide' ? 'Wide' : 'Drawer'
  const heightValue = heightLabels[selectedLayoutId] ?? 'Default'
  const walletValue = getWalletLabel(
    isExternalWalletManagement,
    isPartialWalletManagement
  )

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
                value={modeValue}
                onClick={() => setActiveView('mode')}
              />
              <NavListItem
                icon={<ViewSidebarOutlinedIcon />}
                label="Variant"
                value={variantValue}
                onClick={() => setActiveView('variant')}
              />
              <NavListItem
                icon={<HeightOutlinedIcon />}
                label="Height"
                value={heightValue}
                onClick={() => setActiveView('height')}
              />
              <NavListItem
                icon={<AccountBalanceWalletOutlinedIcon />}
                label="Wallet management"
                value={walletValue}
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
                value={themeLabel}
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
