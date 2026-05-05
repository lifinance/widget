import { Box, styled } from '@mui/material'
import type { FC } from 'react'
import { getCardFieldsetBackgroundColor } from '../../utils/color.js'

export { CapitalizeFirstLetter } from './DetailView.style.js'

const ControlContainer: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...getCardFieldsetBackgroundColor(theme),
    borderRadius: Math.max(
      theme.shape.borderRadius,
      theme.shape.borderRadiusSecondary
    ),
    padding: theme.spacing(0.5, 2.5),
    gap: theme.spacing(0.5),
    minHeight: theme.spacing(7),
  })
)

export const ColorControlContainer: FC<
  React.ComponentProps<typeof ControlContainer>
> = styled(ControlContainer)(({ theme }) => ({
  height: theme.spacing(7),
  paddingRight: theme.spacing(0.5),
}))
