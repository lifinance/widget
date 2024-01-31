import { BoxProps, InputBase } from '@mui/material';
import { useConfigColorsFromPath } from '../../../store';
import { ExpandableCard } from '../../ExpandableCard';
import {
  ColorSelectorContainer,
  ColorSwatch,
  ColorSwatches,
  ColorValueButton,
  TabButtonsContainer,
} from './DesignControls.style';

interface ColorSelectorProps extends BoxProps {
  colorName: string;
  colorValue?: string;
}

const ColorSelector = ({
  colorName,
  colorValue,
  ...rest
}: ColorSelectorProps) => {
  return colorValue ? (
    <ColorSelectorContainer {...rest}>
      {colorName}
      <ColorValueButton type="color" value={colorValue} />
    </ColorSelectorContainer>
  ) : null;
};

export const ColorControl = () => {
  const [primary, secondary] = useConfigColorsFromPath(
    'theme.palette.primary.main',
    'theme.palette.secondary.main',
  );

  const swatches = (
    <ColorSwatches>
      {primary && <ColorSwatch color={primary} />}
      {secondary && <ColorSwatch color={secondary} />}
    </ColorSwatches>
  );

  return (
    <ExpandableCard title={'Color'} value={swatches}>
      <ColorSelector colorName="Primary" colorValue={primary} mt={1} />
      <ColorSelector colorName="Secondary" colorValue={secondary} mt={1} />
    </ExpandableCard>
  );
};
