import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import { Tooltip } from '@mui/material'
import type { JSX } from 'react'
import {
  BackButton,
  BackIcon,
  HeaderContainer,
  HeaderIconButton,
} from './DetailViewHeader.style.js'
import { tooltipPopperZIndex } from './DrawerControls.style.js'

interface DetailViewHeaderProps {
  onBack: () => void
  onReset: () => void
}

export const DetailViewHeader = ({
  onBack,
  onReset,
}: DetailViewHeaderProps): JSX.Element => {
  return (
    <HeaderContainer>
      <BackButton onClick={onBack} disableRipple type="button">
        <BackIcon aria-hidden />
        Back
      </BackButton>
      <Tooltip
        title="Reset config"
        slotProps={{
          popper: { style: { zIndex: tooltipPopperZIndex } },
        }}
        arrow
      >
        <HeaderIconButton
          onClick={onReset}
          size="small"
          aria-label="Reset config"
        >
          <RefreshOutlinedIcon />
        </HeaderIconButton>
      </Tooltip>
    </HeaderContainer>
  )
}
