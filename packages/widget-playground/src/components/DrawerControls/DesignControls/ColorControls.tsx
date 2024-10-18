import type { BoxProps } from '@mui/material'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useConfigColorsFromPath } from '../../../store/widgetConfig/useConfigValues'
import { safe6DigitHexColor } from '../../../utils/color'
import { ExpandableCard } from '../../Card/ExpandableCard'
import {
  CapitalizeFirstLetter,
  ColorControlContainer,
  ColorInput,
  ColorSwatch,
  ColorSwatches,
} from './DesignControls.style'

const editableColors = {
  primary: 'theme.palette.primary.main',
  secondary: 'theme.palette.secondary.main',
  background: 'theme.palette.background.default',
  paper: 'theme.palette.background.paper',
  'text primary': 'theme.palette.text.primary',
  'text secondary': 'theme.palette.text.secondary',
  success: 'theme.palette.success.main',
  warning: 'theme.palette.warning.main',
  error: 'theme.palette.error.main',
  info: 'theme.palette.info.main',
  black: 'theme.palette.common.black',
  white: 'theme.palette.common.white',
  'grey 200': 'theme.palette.grey.200',
  'grey 300': 'theme.palette.grey.300',
  'grey 700': 'theme.palette.grey.700',
  'grey 800': 'theme.palette.grey.800',
}

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
  )
}

interface ColorSelectorProps extends BoxProps {
  colorName: string
  colorPath: string
}
const ColorSelector = ({
  colorName,
  colorPath,
  ...rest
}: ColorSelectorProps) => {
  const [colorValue] = useConfigColorsFromPath(colorPath)
  const { setColor } = useConfigActions()

  return colorValue ? (
    <ColorControlContainer {...rest}>
      <CapitalizeFirstLetter>{colorName}</CapitalizeFirstLetter>
      <ColorInput
        aria-label={`${colorName} color selection`}
        type="color"
        value={safe6DigitHexColor(colorValue).toUpperCase()}
        onChange={(e) => setColor(colorPath, e.target.value)}
      />
    </ColorControlContainer>
  ) : null
}

const Swatches = () => {
  const colorValues = useConfigColorsFromPath(...Object.values(editableColors))

  return (
    <ColorSwatches>
      {Object.values(editableColors).map((colorConfigPath, i) =>
        colorValues[i] ? (
          <ColorSwatch key={colorConfigPath} color={colorValues[i]!} />
        ) : null
      )}
    </ColorSwatches>
  )
}
