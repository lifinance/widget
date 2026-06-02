import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Tooltip } from '@mui/material'
import type { JSX } from 'react'
import { tooltipPopperZIndex } from '../../utils/sidebar.js'
import {
  BrandSuffix,
  HeaderActions,
  HeaderContainer,
  HeaderIconButton,
  HeaderLogo,
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
  return (
    <HeaderContainer>
      <LogoContainer>
        <HeaderLogo />
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
          title="Close tools"
          slotProps={{
            popper: { style: { zIndex: tooltipPopperZIndex } },
          }}
          arrow
        >
          <HeaderIconButton onClick={onToggleDrawer} size="small">
            <CloseIcon />
          </HeaderIconButton>
        </Tooltip>
      </HeaderActions>
    </HeaderContainer>
  )
}
