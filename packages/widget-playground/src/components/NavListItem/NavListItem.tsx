import { Collapse } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import {
  ChevronIcon,
  NavChevronIcon,
  NavItemButton,
  NavItemContent,
  NavItemExpandedContent,
  NavItemLabel,
  NavItemTrailing,
  NavItemValue,
  NavListItemRoot,
} from './NavListItem.style.js'

interface NavListItemExpandableProps {
  icon: ReactNode
  label: string
  value?: string
  expandable: true
  expanded: boolean
  onToggle: () => void
  children: ReactNode
}

interface NavListItemNavigableProps {
  icon: ReactNode
  label: string
  value?: string
  expandable?: false
  onClick: () => void
}

type NavListItemProps = NavListItemExpandableProps | NavListItemNavigableProps

export const NavListItem = (props: NavListItemProps): JSX.Element => {
  const { icon, label } = props

  if (props.expandable) {
    return (
      <NavListItemRoot>
        <NavItemButton onClick={props.onToggle} disableRipple>
          <NavItemContent>
            {icon}
            <NavItemLabel>{label}</NavItemLabel>
          </NavItemContent>
          <NavItemTrailing>
            {props.value ? <NavItemValue>{props.value}</NavItemValue> : null}
            <ChevronIcon expanded={props.expanded} />
          </NavItemTrailing>
        </NavItemButton>
        <Collapse in={props.expanded}>
          <NavItemExpandedContent>{props.children}</NavItemExpandedContent>
        </Collapse>
      </NavListItemRoot>
    )
  }

  return (
    <NavItemButton onClick={props.onClick} disableRipple>
      <NavItemContent>
        {icon}
        <NavItemLabel>{label}</NavItemLabel>
      </NavItemContent>
      <NavItemTrailing>
        {props.value ? <NavItemValue>{props.value}</NavItemValue> : null}
        <NavChevronIcon />
      </NavItemTrailing>
    </NavItemButton>
  )
}
