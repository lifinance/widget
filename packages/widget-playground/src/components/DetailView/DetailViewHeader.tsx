import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import { Tooltip } from '@mui/material'
import type { JSX } from 'react'
import { tooltipPopperZIndex } from '../../utils/sidebar.js'
import {
  BackButton,
  BackIcon,
  HeaderContainer,
  HeaderIconButton,
} from './DetailViewHeader.style.js'

interface DetailViewHeaderProps {
  onBack: () => void
  onReset?: () => void
  resetLabel?: string
}

export const DetailViewHeader = ({
  onBack,
  onReset,
  resetLabel = 'Reset config',
}: DetailViewHeaderProps): JSX.Element => {
  return (
    <HeaderContainer>
      <BackButton onClick={onBack} disableRipple type="button">
        <BackIcon aria-hidden />
        Back
      </BackButton>
      {onReset ? (
        <Tooltip
          title={resetLabel}
          slotProps={{
            popper: { style: { zIndex: tooltipPopperZIndex } },
          }}
          arrow
        >
          <HeaderIconButton
            onClick={onReset}
            size="small"
            aria-label={resetLabel}
          >
            <RefreshOutlinedIcon />
          </HeaderIconButton>
        </Tooltip>
      ) : null}
    </HeaderContainer>
  )
}
