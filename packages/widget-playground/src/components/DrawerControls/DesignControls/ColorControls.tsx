import type { BoxProps, PaletteMode } from '@mui/material'
import { useThemeMode } from '../../../hooks/useThemeMode.js'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions.js'
import { useConfigColorsFromPath } from '../../../store/widgetConfig/useConfigValues.js'
import { safe6DigitHexColor } from '../../../utils/color.js'
import { ExpandableCard } from '../../Card/ExpandableCard.js'
import {
  CapitalizeFirstLetter,
  ColorControlContainer,
  ColorInput,
  ColorSwatch,
  ColorSwatches,
} from './DesignControls.style.js'

const getEditableColors = (themeMode: PaletteMode) => ({
  primary: `theme.colorSchemes.${themeMode}.palette.primary.main`,
  secondary: `theme.colorSchemes.${themeMode}.palette.secondary.main`,
  background: `theme.colorSchemes.${themeMode}.palette.background.default`,
  paper: `theme.colorSchemes.${themeMode}.palette.background.paper`,
  'text primary': `theme.colorSchemes.${themeMode}.palette.text.primary`,
  'text secondary': `theme.colorSchemes.${themeMode}.palette.text.secondary`,
  success: `theme.colorSchemes.${themeMode}.palette.success.main`,
  warning: `theme.colorSchemes.${themeMode}.palette.warning.main`,
  error: `theme.colorSchemes.${themeMode}.palette.error.main`,
  info: `theme.colorSchemes.${themeMode}.palette.info.main`,
  black: `theme.colorSchemes.${themeMode}.palette.common.black`,
  white: `theme.colorSchemes.${themeMode}.palette.common.white`,
  'grey 200': `theme.colorSchemes.${themeMode}.palette.grey.200`,
  'grey 300': `theme.colorSchemes.${themeMode}.palette.grey.300`,
  'grey 700': `theme.colorSchemes.${themeMode}.palette.grey.700`,
  'grey 800': `theme.colorSchemes.${themeMode}.palette.grey.800`,
})

export const ColorControl = () => {
  const { themeMode } = useThemeMode()
  const editableColors = getEditableColors(themeMode)
  return (
    <ExpandableCard
      title={'Colors'}
      value={<Swatches />}
      data-testid="color-section"
    >
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
  const { themeMode } = useThemeMode()
  const editableColors = getEditableColors(themeMode)
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
