import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Tooltip } from '@mui/material'
import type { JSX } from 'react'
import { tooltipPopperZIndex } from './DrawerControls.style.js'
import { LiFiPlaygroundLogo } from './LiFiPlaygroundLogo.js'
import {
  HeaderActions,
  HeaderContainer,
  HeaderIconButton,
} from './SidebarHeader.style.js'

interface SidebarHeaderProps {
  onReset: () => void
  onToggleDrawer: () => void
}

export const SidebarHeader = ({
  onReset,
  onToggleDrawer,
}: SidebarHeaderProps): JSX.Element => {
  return (
    <HeaderContainer>
      <LiFiPlaygroundLogo />
      <HeaderActions>
        <Tooltip
          title="Reset config"
          slotProps={{
            popper: { style: { zIndex: tooltipPopperZIndex } },
          }}
          arrow
        >
          <HeaderIconButton onClick={onReset} size="small">
            <RefreshIcon />
          </HeaderIconButton>
        </Tooltip>
        <Tooltip
          title="Toggle sidebar"
          slotProps={{
            popper: { style: { zIndex: tooltipPopperZIndex } },
          }}
          arrow
        >
          <HeaderIconButton onClick={onToggleDrawer} size="small">
            <MenuOpenIcon />
          </HeaderIconButton>
        </Tooltip>
      </HeaderActions>
    </HeaderContainer>
  )
}
