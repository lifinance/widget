import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const NavItemButton: FC<React.ComponentProps<typeof ButtonBase>> =
  styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%',
    flexShrink: 0,
    minHeight: 48,
    height: 48,
    padding: theme.spacing(1.5, 1),
    borderRadius: 12,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
      ...theme.applyStyles('dark', {
        backgroundColor: theme.vars.palette.grey[800],
      }),
    },
  }))

export const NavItemContent: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flex: '1 0 0',
    minWidth: 0,
  })
)

export const NavItemLabel: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  flex: '1 0 0',
  minWidth: 0,
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
  textAlign: 'left',
}))

interface ChevronIconProps {
  expanded: boolean
}

export const ChevronIcon: FC<
  React.ComponentProps<typeof KeyboardArrowDownOutlinedIcon> & ChevronIconProps
> = styled(KeyboardArrowDownOutlinedIcon, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<ChevronIconProps>(({ theme, expanded }) => ({
  color: theme.vars.palette.text.secondary,
  transition: 'transform 0.2s ease',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
}))

export const NavItemValue: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  color: theme.vars.palette.text.secondary,
  whiteSpace: 'nowrap',
  flexShrink: 0,
}))

export const NavItemTrailing: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  flexShrink: 0,
}))

export const NavChevronIcon: FC<
  React.ComponentProps<typeof KeyboardArrowRightOutlinedIcon>
> = styled(KeyboardArrowRightOutlinedIcon)(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
}))

export const NavItemExpandedContent: FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 0),
  }))
