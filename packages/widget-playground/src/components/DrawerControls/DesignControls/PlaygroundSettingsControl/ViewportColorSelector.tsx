import type { BoxProps } from '@mui/material';
import { useDefaultViewportColor } from '../../../../hooks';
import {
  usePlaygroundSettingValues,
  useSetViewportBackgroundColor,
} from '../../../../store';
import { safe6DigitHexColor } from '../../../../utils';
import {
  CapitalizeFirstLetter,
  ColorControlContainer,
  ColorInput,
} from '../DesignControls.style';

export const ViewportColorSelector = ({ ...rest }: BoxProps) => {
  const { defaultColor } = useDefaultViewportColor();
  const { viewportColor } = usePlaygroundSettingValues();
  const { setViewportBackgroundColor } = useSetViewportBackgroundColor();

  return (
    <ColorControlContainer {...rest}>
      <CapitalizeFirstLetter>Viewport background</CapitalizeFirstLetter>
      <ColorInput
        aria-label={`Viewport background color selection`}
        type="color"
        value={safe6DigitHexColor(viewportColor || defaultColor)}
        onChange={(e) => setViewportBackgroundColor(e.target.value)}
      />
    </ColorControlContainer>
  );
};
