import MoreVertIcon from '@mui/icons-material/MoreVert'
import type { SxProps, Theme } from '@mui/material'
import { MenuItem } from '@mui/material'
import { type JSX, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContextMenuButton } from './ContextMenu.style.js'
import { Menu } from './Menu.js'

export interface ContextMenuItemConfig {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

interface ContextMenuProps {
  items: ContextMenuItemConfig[]
  disabled?: boolean
  buttonSx?: SxProps<Theme>
}

export const ContextMenu = ({
  items,
  disabled,
  buttonSx,
}: ContextMenuProps): JSX.Element => {
  const { t } = useTranslation()
  const menuId = useId()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const handleItemClick = (onClick: () => void) => () => {
    onClick()
    closeMenu()
  }

  return (
    <>
      <ContextMenuButton
        aria-label={t('button.options')}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
        sx={{ opacity: disabled ? 0.5 : 1, ...buttonSx }}
        disableRipple
      >
        <MoreVertIcon fontSize="small" />
      </ContextMenuButton>
      <Menu
        id={menuId}
        elevation={0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
      >
        {items.map((item) => (
          <MenuItem key={item.label} onClick={handleItemClick(item.onClick)}>
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
