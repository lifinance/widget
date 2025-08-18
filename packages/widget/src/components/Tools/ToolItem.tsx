import { Avatar, Checkbox, ListItemAvatar } from '@mui/material'
import { memo, useCallback } from 'react'
import { ListItemText } from '../ListItemText.js'
import { SettingsListItemButton } from '../SettingsListItemButton.js'

interface ToolItemProps {
  tool: any
  typeKey: string
  isEnabled: boolean
  onToggle: (key: string) => void
}

export const ToolItem = memo<ToolItemProps>(
  ({ tool, typeKey, isEnabled, onToggle }) => {
    const handleClick = useCallback(() => {
      onToggle(tool.key)
    }, [onToggle, tool.key])

    const handleCheckboxClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      onToggle(tool.key)
    }

    return (
      <SettingsListItemButton onClick={handleClick}>
        <ListItemAvatar>
          <Avatar src={tool.logoURI} alt={tool.name}>
            {tool.name[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={tool.name} />
        <Checkbox
          id={`${typeKey}-${tool.key}-checkbox`}
          checked={isEnabled}
          onChange={handleClick}
          onClick={handleCheckboxClick}
          sx={{ mr: -1 }}
        />
      </SettingsListItemButton>
    )
  }
)
