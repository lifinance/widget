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

const editableColors = {
  'primary main': 'theme.palette.primary.main',
  'primary light': 'theme.palette.primary.light',
  'primary dark': 'theme.palette.primary.dark',
  'primary contrast text': 'theme.palette.primary.contrastText',
  'secondary main ': 'theme.palette.secondary.main',
  'secondary light': 'theme.palette.secondary.light',
  'secondary dark': 'theme.palette.secondary.dark',
  'secondary contrast text': 'theme.palette.secondary.contrastText',
  'success main ': 'theme.palette.success.main',
  'success light': 'theme.palette.success.light',
  'success dark': 'theme.palette.success.dark',
  'success contrast text': 'theme.palette.success.contrastText',
  'warning main ': 'theme.palette.warning.main',
  'warning light': 'theme.palette.warning.light',
  'warning dark': 'theme.palette.warning.dark',
  'warning contrast text': 'theme.palette.warning.contrastText',
  'error main ': 'theme.palette.error.main',
  'error light': 'theme.palette.error.light',
  'error dark': 'theme.palette.error.dark',
  'error contrast text': 'theme.palette.error.contrastText',
  'info main ': 'theme.palette.info.main',
  'info light': 'theme.palette.info.light',
  'info dark': 'theme.palette.info.dark',
  'info contrast text': 'theme.palette.info.contrastText',
  'text primary': 'theme.palette.text.primary',
  'text secondary': 'theme.palette.text.secondary',
  'text disabled': 'theme.palette.text.disabled',
  'background default': 'theme.palette.background.default',
  'background paper': 'theme.palette.background.paper',
  'grey 200': 'theme.palette.grey.200',
  'grey 300': 'theme.palette.grey.300',
  'grey 700': 'theme.palette.grey.700',
  'grey 800': 'theme.palette.grey.800',
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
        value={safe6DigitHexColor(colorValue).toUpperCase()}
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
