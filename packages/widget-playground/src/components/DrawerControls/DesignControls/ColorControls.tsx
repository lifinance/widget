import type { BoxProps } from '@mui/material';
import { safe6DigitHexColor } from '../../../utils';
import { useConfigActions, useConfigColorsFromPath } from '../../../store';
import { ExpandableCard } from '../../Card';
import {
  ColorSelectorContainer,
  ColorSwatch,
  ColorSwatches,
  ColorInput,
  CapitalizeFirstLetter,
} from './DesignControls.style';

// NOTE: editable colors need to also feature in the default config for the color controls to appear
//  see app/store/defaultWidgetConfig.ts
const editableColors = {
  'primary main': 'theme.palette.primary.main',
  'primary light': 'theme.palette.primary.light',
  'primary dark': 'theme.palette.primary.dark',
  'primary contrast text': 'theme.palette.primary.contrastText',
  'secondary main ': 'theme.palette.secondary.main',
  'secondary light': 'theme.palette.secondary.light',
  'secondary dark': 'theme.palette.secondary.dark',
  'secondary contrast text': 'theme.palette.secondary.contrastText',
  'text primary': 'theme.palette.text.primary',
  'text secondary': 'theme.palette.text.secondary',
  'text disabled': 'theme.palette.text.disabled',
  'background default': 'theme.palette.background.default',
  'background paper': 'theme.palette.background.paper',
  'grey 50': 'theme.palette.grey.50',
  'grey 100': 'theme.palette.grey.100',
  'grey 200': 'theme.palette.grey.200',
  'grey 300': 'theme.palette.grey.300',
  'grey 400': 'theme.palette.grey.400',
  'grey 500': 'theme.palette.grey.500',
  'grey 600': 'theme.palette.grey.600',
  'grey 700': 'theme.palette.grey.700',
  'grey 800': 'theme.palette.grey.800',
  'grey 900': 'theme.palette.grey.900',
  'grey A100': 'theme.palette.grey.A100',
  'grey A200': 'theme.palette.grey.A200',
  'grey A400': 'theme.palette.grey.A400',
  'grey A700': 'theme.palette.grey.A700',
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
      <CapitalizeFirstLetter>{colorName}</CapitalizeFirstLetter>
      <ColorInput
        aria-label={`${colorName} color selection`}
        type="color"
        value={safe6DigitHexColor(colorValue)}
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
