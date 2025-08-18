import type { BoxProps } from '@mui/material'
import { useTheme } from '@mui/material'
import { useEditToolsActions } from '../../../../store/editTools/useEditToolsActions.js'
import { usePlaygroundSettingValues } from '../../../../store/editTools/usePlaygroundSettingValues.js'
import { safe6DigitHexColor } from '../../../../utils/color.js'
import {
  CapitalizeFirstLetter,
  ColorControlContainer,
  ColorInput,
} from '../DesignControls.style.js'

export const ViewportColorSelector = ({ ...rest }: BoxProps) => {
  const theme = useTheme()
  const { viewportColor } = usePlaygroundSettingValues()
  const { setViewportBackgroundColor } = useEditToolsActions()

  const defaultColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.common.black

  return (
    <ColorControlContainer {...rest}>
      <CapitalizeFirstLetter>Viewport background</CapitalizeFirstLetter>
      <ColorInput
        aria-label={'Viewport background color selection'}
        type="color"
        value={safe6DigitHexColor(viewportColor || defaultColor)}
        onChange={(e) => setViewportBackgroundColor(e.target.value)}
      />
    </ColorControlContainer>
  )
}
