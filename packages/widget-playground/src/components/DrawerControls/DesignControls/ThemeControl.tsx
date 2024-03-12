import { CardValue, ExpandableCard } from '../../Card';
import type { SelectChangeEvent } from '@mui/material';
import { MenuItem } from '@mui/material';
import { popperZIndex } from '../DrawerControls.style';
import { Select } from './DesignControls.style';
import { useConfigActions, useEditToolsActions } from '../../../store';
import { useThemeToolValues } from '../../../store/editTools/useThemeToolValues';

export const ThemeControl = () => {
  const { setConfigTheme } = useConfigActions();
  const { selectedThemeId, selectedTheme, allThemeItems } =
    useThemeToolValues();
  const { setViewportBackgroundColor, setSelectedTheme } =
    useEditToolsActions();

  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelectedTheme(event.target.value);

    const themeItem = allThemeItems?.find(
      (themeItem) => themeItem.id === event.target.value,
    );

    if (themeItem) {
      setConfigTheme(themeItem.theme);
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
        {allThemeItems?.map(({ name, id }) => {
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
