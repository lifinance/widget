import SettingsIcon from '@mui/icons-material/Settings';
import { ExpandableCard } from '../../Card';
import { useEditToolsActions } from '../../../store';
import { ColorInput, ColorSelectorContainer } from './DesignControls.style';
import { usePlaygroundSettingValues } from '../../../store/editTools/usePlaygroundSettingValues';
import { BoxProps, useTheme } from '@mui/material';

export const PlaygroundSettingsControl = () => {
  return (
    <ExpandableCard
      title={'Playground settings'}
      value={<SettingsIcon />}
      alwaysShowTitleValue
    >
      <ViewportColorSelector sx={{ marginTop: 1 }} />
    </ExpandableCard>
  );
};

export const ViewportColorSelector = ({ ...rest }: BoxProps) => {
  const theme = useTheme();
  const { viewportColor } = usePlaygroundSettingValues();
  const { setViewportBackgroundColor } = useEditToolsActions();

  const defaultColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.common.black;

  return (
    <ColorSelectorContainer {...rest}>
      Viewport background
      <ColorInput
        aria-label={`Viewport background color selection`}
        type="color"
        value={viewportColor || defaultColor}
        onChange={(e) => setViewportBackgroundColor(e.target.value)}
      />
    </ColorSelectorContainer>
  );
};
