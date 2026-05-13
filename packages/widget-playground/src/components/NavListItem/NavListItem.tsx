import { Box, Collapse } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import {
  ChevronIcon,
  NavItemButton,
  NavItemContent,
  NavItemExpandedContent,
  NavItemLabel,
} from './NavListItem.style.js'

interface NavListItemExpandableProps {
  icon: ReactNode
  label: string
  expandable: true
  expanded: boolean
  onToggle: () => void
  children: ReactNode
}

interface NavListItemNavigableProps {
  icon: ReactNode
  label: string
  expandable?: false
  onClick: () => void
}

type NavListItemProps = NavListItemExpandableProps | NavListItemNavigableProps

export const NavListItem = (props: NavListItemProps): JSX.Element => {
  const { icon, label } = props

  if (props.expandable) {
    return (
      <Box>
        <NavItemButton onClick={props.onToggle} disableRipple>
          <NavItemContent>
            {icon}
            <NavItemLabel>{label}</NavItemLabel>
          </NavItemContent>
          <ChevronIcon expanded={props.expanded} />
        </NavItemButton>
        <Collapse in={props.expanded}>
          <NavItemExpandedContent>{props.children}</NavItemExpandedContent>
        </Collapse>
      </Box>
    )
  }

  return (
    <NavItemButton onClick={props.onClick} disableRipple>
      <NavItemContent>
        {icon}
        <NavItemLabel>{label}</NavItemLabel>
      </NavItemContent>
    </NavItemButton>
  )
}
