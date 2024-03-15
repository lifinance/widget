import type { SelectChangeEvent } from '@mui/material';
import { MenuItem } from '@mui/material';
import { CardValue, ExpandableCard } from '../../Card';
import {
  useConfigActions,
  useEditToolsActions,
  useThemeValues,
} from '../../../store';
import { popperZIndex } from '../DrawerControls.style';
import { Select } from './DesignControls.style';
import type { ThemeItem } from '../../../store/editTools/types';
export const ThemeControl = () => {
  const { setConfigTheme } = useConfigActions();
  const { selectedThemeId, selectedTheme, allThemesItems } = useThemeValues();
  const { setViewportBackgroundColor } = useEditToolsActions();

  const handleChange = (event: SelectChangeEvent<any>) => {
    const themeItem = allThemesItems?.find(
      (themeItem) => themeItem.id === event.target.value,
    );

    if (themeItem) {
      setConfigTheme(themeItem.theme, event.target.value);
      setViewportBackgroundColor(
        themeItem.theme.playground?.background as string | undefined,
      );
    }
  };

  return (
    <ExpandableCard
      title={'Base theme'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>
          {selectedTheme?.name ? selectedTheme?.name : 'default'}
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
          );
        })}
      </Select>
    </ExpandableCard>
  );
};
