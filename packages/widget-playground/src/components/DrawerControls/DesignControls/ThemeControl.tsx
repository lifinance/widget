import type { SelectChangeEvent } from '@mui/material'
import { MenuItem } from '@mui/material'
import { useThemeMode } from '../../../hooks/useThemeMode.js'
import type { ThemeItem } from '../../../store/editTools/types.js'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions.js'
import { useThemeValues } from '../../../store/widgetConfig/useThemeValues.js'
import { CardValue } from '../../Card/Card.style.js'
import { ExpandableCard } from '../../Card/ExpandableCard.js'
import { popperZIndex } from '../DrawerControls.style.js'
import { Select } from './DesignControls.style.js'

export const ThemeControl = () => {
  const { setConfigTheme } = useConfigActions()
  const { themeMode } = useThemeMode()
  const { selectedThemeId, selectedThemeItem, allThemesItems } =
    useThemeValues()
  const { setViewportBackgroundColor } = useEditToolsActions()

  const handleChange = (event: SelectChangeEvent<any>) => {
    const themeItem = allThemesItems?.find(
      (themeItem) => themeItem.id === event.target.value
    )

    if (themeItem) {
      setConfigTheme(themeItem.theme, event.target.value)
      setViewportBackgroundColor(
        themeItem.theme.colorSchemes?.[themeMode]?.palette?.playground?.main
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
      data-testid="theme-section"
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
