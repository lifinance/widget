import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Tooltip, useTheme } from '@mui/material'
import type { JSX } from 'react'
import { LiFiLogo } from '../../logo/LiFiLogo.js'
import { tooltipPopperZIndex } from './DrawerControls.style.js'
import {
  BrandSuffix,
  HeaderActions,
  HeaderContainer,
  HeaderIconButton,
  LogoContainer,
} from './SidebarHeader.style.js'

interface SidebarHeaderProps {
  onReset: () => void
  onToggleDrawer: () => void
}

export const SidebarHeader = ({
  onReset,
  onToggleDrawer,
}: SidebarHeaderProps): JSX.Element => {
  const theme = useTheme()
  return (
    <HeaderContainer>
      <LogoContainer>
        <LiFiLogo
          style={{
            display: 'block',
            height: 24,
            width: 'auto',
            maxWidth: '100%',
            color: theme.vars.palette.text.primary,
            marginTop: -1,
          }}
        />
        <BrandSuffix>PLAYGROUND</BrandSuffix>
      </LogoContainer>
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
