import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined'
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import { Divider } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useSidebarNavLabels } from '../../hooks/useSidebarNavLabels.js'
import { useThemeMode } from '../../hooks/useThemeMode.js'
import { useFontInitialisation } from '../../providers/FontLoaderProvider/FontLoaderProvider.js'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { usePlaygroundWidgetMode } from '../../store/widgetConfig/useConfigValues.js'
import type { SidebarView } from '../../types.js'
import {
  clearPlaygroundBookmarkStores,
  readPlaygroundBookmarksSeeded,
} from '../../utils/bookmarkStores.js'
import { setQueryStringParam } from '../../utils/setQueryStringParam.js'
import { CheckoutControls } from '../CheckoutControls/CheckoutControls.js'
import {
  SlideViewPanel,
  SlideViewTrack,
} from '../DetailView/SlideView.style.js'
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
} from './DrawerControls.style.js'
import { SidebarFooter } from './SidebarFooter.js'
import { SidebarHeader } from './SidebarHeader.js'

interface DetailViewProps {
  onBack: () => void
}

const DETAIL_VIEWS: Partial<
  Record<Exclude<SidebarView, 'nav'>, (props: DetailViewProps) => JSX.Element>
> = {
  mode: ModeDetailView,
  variant: VariantDetailView,
  height: HeightDetailView,
  wallet: WalletManagementDetailView,
  developer: DeveloperControlsDetailView,
  themeEdit: ThemeEditDetailView,
  checkout: CheckoutControls,
}

export const DrawerControls = (): JSX.Element => {
  const { isDrawerOpen, drawerWidth } = useDrawerToolValues()
  const { setDrawerOpen, resetEditTools } = useEditToolsActions()
  const { resetConfig } = useConfigActions()
  const { setMode } = useThemeMode()
  const [activeView, setActiveView] = useState<SidebarView>('nav')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const { themeLabel, modeValue, variantValue, heightValue, walletValue } =
    useSidebarNavLabels()
  const { playgroundWidgetMode } = usePlaygroundWidgetMode()

  useFontInitialisation()

  const handleResetAll = useCallback((): void => {
    setQueryStringParam('devView', false)
    setQueryStringParam('allWidgetEvents', false)
    resetConfig()
    resetEditTools()
    setMode('system')
    if (readPlaygroundBookmarksSeeded()) {
      clearPlaygroundBookmarkStores()
    }
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

  const ActiveDetailView =
    activeView !== 'nav' ? DETAIL_VIEWS[activeView] : undefined

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
      drawerWidth={drawerWidth}
    >
      <SidebarContainer drawerWidth={drawerWidth}>
        <SlideViewTrack showSecondary={activeView !== 'nav'}>
          <SlideViewPanel>
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
              {playgroundWidgetMode === 'checkout' ? (
                <NavListItem
                  icon={<ShoppingCartOutlinedIcon />}
                  label="Checkout"
                  onClick={() => setActiveView('checkout')}
                />
              ) : null}
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
          </SlideViewPanel>
          <SlideViewPanel>
            {ActiveDetailView ? (
              <ActiveDetailView onBack={handleNavigateBack} />
            ) : null}
          </SlideViewPanel>
        </SlideViewTrack>
      </SidebarContainer>
    </Drawer>
  )
}
