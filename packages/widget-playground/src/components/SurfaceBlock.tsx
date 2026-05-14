import { Box, Collapse, Divider } from '@mui/material'
import type { JSX } from 'react'
import { safe6DigitHexColor } from '../utils/color.js'
import { BorderWeightRow } from './BorderWeightRow.js'
import { SectionHeading } from './DetailView/DetailView.style.js'
import { EditableColorRow } from './EditableColorRow/EditableColorRow.js'
import { EditableSliderValue } from './EditableSliderValue/EditableSliderValue.js'
import {
  SliderRow,
  ThemeSlider,
} from './EditableSliderValue/EditableSliderValue.style.js'
import {
  RowLabel,
  SubRow,
  SubSection,
  ToggleRow,
  ToggleRowLabel,
} from './Row.style.js'
import { Switch } from './Switch.style.js'

interface SurfaceBlockProps {
  title: string
  radius: number
  onRadiusChange: (n: number) => void
  radiusMax: number
  shadowOn: boolean
  onShadowOnChange: (on: boolean) => void
  shadowOffsetX: number
  onShadowOffsetXChange: (x: number) => void
  shadowOffsetY: number
  onShadowOffsetYChange: (y: number) => void
  shadowBlur: number
  onShadowBlurChange: (blur: number) => void
  shadowSpread: number
  onShadowSpreadChange: (spread: number) => void
  borderOn: boolean
  onBorderOnChange: (on: boolean) => void
  borderColor: string
  onBorderColorChange: (hex: string) => void
  borderWeight: number
  onBorderWeightChange: (w: number) => void
}

export const SurfaceBlock = ({
  title,
  radius,
  onRadiusChange,
  radiusMax,
  shadowOn,
  onShadowOnChange,
  shadowOffsetX,
  onShadowOffsetXChange,
  shadowOffsetY,
  onShadowOffsetYChange,
  shadowBlur,
  onShadowBlurChange,
  shadowSpread,
  onShadowSpreadChange,
  borderOn,
  onBorderOnChange,
  borderColor,
  onBorderColorChange,
  borderWeight,
  onBorderWeightChange,
}: SurfaceBlockProps): JSX.Element => {
  return (
    <Box>
      <Divider sx={{ my: '40px' }} />
      <SectionHeading sx={{ marginTop: 0 }}>{title}</SectionHeading>
      <SliderRow>
        <RowLabel>Corner radius</RowLabel>
        <ThemeSlider
          size="small"
          value={radius}
          min={0}
          max={radiusMax}
          onChange={(_, v) => onRadiusChange(v as number)}
          aria-label={`${title} corner radius`}
        />
        <EditableSliderValue
          value={radius}
          min={0}
          max={radiusMax}
          onChange={onRadiusChange}
          ariaLabel={`${title} corner radius`}
        />
      </SliderRow>
      <ToggleRow>
        <ToggleRowLabel>Shadow</ToggleRowLabel>
        <Switch
          checked={shadowOn}
          onChange={(_, c) => onShadowOnChange(c)}
          aria-label={`${title} shadow`}
        />
      </ToggleRow>
      <Collapse in={shadowOn} unmountOnExit>
        <SubSection>
          <SubRow>
            <RowLabel>Offset X</RowLabel>
            <ThemeSlider
              size="small"
              value={shadowOffsetX}
              min={-8}
              max={8}
              onChange={(_, v) => onShadowOffsetXChange(v as number)}
              aria-label={`${title} shadow offset x`}
            />
            <EditableSliderValue
              value={shadowOffsetX}
              min={-8}
              max={8}
              onChange={onShadowOffsetXChange}
              ariaLabel={`${title} shadow offset x`}
            />
          </SubRow>
          <SubRow>
            <RowLabel>Offset Y</RowLabel>
            <ThemeSlider
              size="small"
              value={shadowOffsetY}
              min={-8}
              max={8}
              onChange={(_, v) => onShadowOffsetYChange(v as number)}
              aria-label={`${title} shadow offset y`}
            />
            <EditableSliderValue
              value={shadowOffsetY}
              min={-8}
              max={8}
              onChange={onShadowOffsetYChange}
              ariaLabel={`${title} shadow offset y`}
            />
          </SubRow>
          <SubRow>
            <RowLabel>Blur</RowLabel>
            <ThemeSlider
              size="small"
              value={shadowBlur}
              min={0}
              max={24}
              onChange={(_, v) => onShadowBlurChange(v as number)}
              aria-label={`${title} shadow blur`}
            />
            <EditableSliderValue
              value={shadowBlur}
              min={0}
              max={24}
              onChange={onShadowBlurChange}
              ariaLabel={`${title} shadow blur`}
            />
          </SubRow>
          <SubRow>
            <RowLabel>Spread</RowLabel>
            <ThemeSlider
              size="small"
              value={shadowSpread}
              min={0}
              max={8}
              onChange={(_, v) => onShadowSpreadChange(v as number)}
              aria-label={`${title} shadow spread`}
            />
            <EditableSliderValue
              value={shadowSpread}
              min={0}
              max={8}
              onChange={onShadowSpreadChange}
              ariaLabel={`${title} shadow spread`}
            />
          </SubRow>
        </SubSection>
      </Collapse>
      <ToggleRow sx={{ mt: 2 }}>
        <ToggleRowLabel>Border</ToggleRowLabel>
        <Switch
          checked={borderOn}
          onChange={(_, c) => onBorderOnChange(c)}
          aria-label={`${title} border`}
        />
      </ToggleRow>
      <Collapse in={borderOn} unmountOnExit>
        <SubSection>
          <EditableColorRow
            label="Color"
            hex={safe6DigitHexColor(borderColor).toUpperCase()}
            ariaLabel={`${title} border color`}
            onChange={onBorderColorChange}
          />
          <BorderWeightRow
            title={title}
            value={borderWeight}
            onChange={onBorderWeightChange}
          />
        </SubSection>
      </Collapse>
    </Box>
  )
}
