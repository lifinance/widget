import type { BoxProps } from '@mui/material';
import { useTheme } from '@mui/material';
import {
  useEditToolsActions,
  usePlaygroundSettingValues,
} from '../../../../store';
import { safe6DigitHexColor } from '../../../../utils';
import {
  CapitalizeFirstLetter,
  ColorInput,
  ControlContainer,
} from '../DesignControls.style';

export const ViewportColorSelector = ({ ...rest }: BoxProps) => {
  const theme = useTheme();
  const { viewportColor } = usePlaygroundSettingValues();
  const { setViewportBackgroundColor } = useEditToolsActions();

  const defaultColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.common.black;

  return (
    <ControlContainer {...rest}>
      <CapitalizeFirstLetter>Viewport background</CapitalizeFirstLetter>
      <ColorInput
        aria-label={`Viewport background color selection`}
        type="color"
        value={safe6DigitHexColor(viewportColor || defaultColor)}
        onChange={(e) => setViewportBackgroundColor(e.target.value)}
      />
    </ControlContainer>
  );
};
