import type { SelectChangeEvent } from '@mui/material'
import { MenuItem } from '@mui/material'
import { useThemeMode } from '../../../hooks/useThemeMode'
import type { ThemeItem } from '../../../store/editTools/types'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useThemeValues } from '../../../store/widgetConfig/useThemeValues'
import { CardValue } from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import { popperZIndex } from '../DrawerControls.style'
import { Select } from './DesignControls.style'

export const ThemeControl = () => {
  const { setConfigTheme } = useConfigActions()
  const themeMode = useThemeMode()
  const { selectedThemeId, selectedThemeItem, allThemesItems } =
    useThemeValues()
  const { setViewportBackgroundColor } = useEditToolsActions()

  const handleChange = (event: SelectChangeEvent<any>) => {
    const themeItem = allThemesItems?.find(
      (themeItem) => themeItem.id === event.target.value
    )

    if (themeItem) {
      let theme = themeItem.theme[themeMode]

      if (!theme) {
        const altThemeMode = themeMode === 'dark' ? 'light' : 'dark'
        theme = themeItem.theme[altThemeMode]
      }

      setConfigTheme(theme, event.target.value)
      setViewportBackgroundColor(
        theme.playground?.background as string | undefined
      )
    }
  }

  return (
    <ExpandableCard
      title={'Base theme'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>
          {selectedThemeItem?.name ? selectedThemeItem?.name : 'default'}
        </CardValue>
      }
    >
      <Select
        value={selectedThemeId}
        onChange={handleChange}
        aria-label="Theme"
        MenuProps={{ sx: { zIndex: popperZIndex } }}
      >
        {allThemesItems?.map(({ name, id }: ThemeItem) => {
          return (
            <MenuItem value={id} key={id}>
              {name}
            </MenuItem>
          )
        })}
      </Select>
    </ExpandableCard>
  )
}
