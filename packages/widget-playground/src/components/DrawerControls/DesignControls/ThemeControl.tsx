import { CardValue, ExpandableCard } from '../../Card';
import type { SelectChangeEvent } from '@mui/material';
import { MenuItem } from '@mui/material';
import { useState } from 'react';
import { useDefaultTheme } from '../../../store/widgetConfig/useDefaultTheme';
import { windows95Theme } from '@lifi/widget';
import { popperZIndex } from '../DrawerControls.style';
import { Select } from './DesignControls.style';
import { useConfigActions, useEditToolsActions } from '../../../store';

const widgetThemeItems = [{ name: 'Windows 95', theme: windows95Theme }];

export const ThemeControl = () => {
  const { defaultTheme } = useDefaultTheme();
  const { setConfigTheme } = useConfigActions();
  const { setViewportBackgroundColor } = useEditToolsActions();
  const defaultThemeItem = { name: 'Default', theme: defaultTheme };
  const [theme, setTheme] = useState(defaultThemeItem);

  const allThemes = [defaultThemeItem, ...widgetThemeItems];

  const handleChange = (event: SelectChangeEvent<any>) => {
    const themeItem = allThemes.find(
      (themeItem) => themeItem.name === event.target.value,
    );

    if (themeItem) {
      setTheme(themeItem);
      setConfigTheme(structuredClone(themeItem.theme));
      setViewportBackgroundColor(themeItem.theme.playground?.background);
    }
  };

  return (
    <ExpandableCard
      title={'Base theme'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>{theme.name}</CardValue>
      }
    >
      <Select
        value={theme.name}
        onChange={handleChange}
        aria-label="Theme"
        MenuProps={{ sx: { zIndex: popperZIndex } }}
      >
        {allThemes.map(({ name }) => {
          return (
            <MenuItem id={name} value={name} key={name}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </ExpandableCard>
  );
};
