import type { BoxProps } from '@mui/material';
import { useConfigActions, useConfigColorsFromPath } from '../../../store';
import { ExpandableCard } from '../../Card';
import {
  ColorSelectorContainer,
  ColorSwatch,
  ColorSwatches,
  ColorInput,
} from './DesignControls.style';

// NOTE: editable colors need to also feature in the default config for the color controls to appear
//  see app/store/defaultWidgetConfig.ts
const editableColors = {
  primary: 'theme.palette.primary.main',
  secondary: 'theme.palette.secondary.main',
};

export const ColorControl = () => {
  return (
    <ExpandableCard title={'Colors'} value={<Swatches />}>
      {Object.entries(editableColors).map(([colorName, colorConfigPath]) => (
        <ColorSelector
          key={colorConfigPath}
          colorName={colorName}
          colorPath={colorConfigPath}
          mt={1}
        />
      ))}
    </ExpandableCard>
  );
};

interface ColorSelectorProps extends BoxProps {
  colorName: string;
  colorPath: string;
}
const ColorSelector = ({
  colorName,
  colorPath,
  ...rest
}: ColorSelectorProps) => {
  const [colorValue] = useConfigColorsFromPath(colorPath);
  const { setColor } = useConfigActions();

  return colorValue ? (
    <ColorSelectorContainer {...rest}>
      {colorName}
      <ColorInput
        aria-label={`${colorName} color selection`}
        type="color"
        value={colorValue}
        onChange={(e) => setColor(colorPath, e.target.value)}
      />
    </ColorSelectorContainer>
  ) : null;
};

const Swatches = () => {
  const colorValues = useConfigColorsFromPath(...Object.values(editableColors));

  return (
    <ColorSwatches>
      {Object.values(editableColors).map((colorConfigPath, i) =>
        colorValues[i] ? (
          <ColorSwatch key={colorConfigPath} color={colorValues[i]!} />
        ) : null,
      )}
    </ColorSwatches>
  );
};
