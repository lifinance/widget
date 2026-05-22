import { Box } from '@mui/material'
import type { FC, JSX } from 'react'
import { memo } from 'react'
import { safe6DigitHexColor } from '../utils/color.js'
import {
  SHADOW_SLIDER_FIELDS,
  type SurfaceBlockProps,
} from '../utils/surface.js'
import { BorderWeightRow } from './BorderWeightRow.js'
import {
  SectionDivider,
  SectionHeading,
} from './DetailView/DetailView.style.js'
import { EditableColorRow } from './EditableColorRow/EditableColorRow.js'
import { SliderRow } from './EditableSliderValue/EditableSliderValue.style.js'
import { SubSection } from './Row.style.js'
import { SurfaceFeatureToggle } from './SurfaceFeatureToggle.js'
import { SurfaceSliderRow } from './SurfaceSliderRow.js'

export const SurfaceBlock: FC<SurfaceBlockProps> = memo(function SurfaceBlock(
  props: SurfaceBlockProps
): JSX.Element {
  const {
    title,
    radius,
    onRadiusChange,
    radiusMax,
    shadowOn,
    onShadowOnChange,
    borderOn,
    onBorderOnChange,
    borderColor,
    onBorderColorChange,
    borderWeight,
    onBorderWeightChange,
  } = props

  return (
    <Box>
      <SectionDivider />
      <SectionHeading sx={{ marginTop: 0 }}>{title}</SectionHeading>
      <SurfaceSliderRow
        row={SliderRow}
        title={title}
        label="Corner radius"
        ariaSuffix="corner radius"
        value={radius}
        min={0}
        max={radiusMax}
        onChange={onRadiusChange}
      />
      <SurfaceFeatureToggle
        title={title}
        label="Shadow"
        checked={shadowOn}
        onChange={onShadowOnChange}
      >
        <SubSection>
          {SHADOW_SLIDER_FIELDS.map((field) => (
            <SurfaceSliderRow
              key={field.label}
              title={title}
              label={field.label}
              ariaSuffix={field.ariaSuffix}
              value={props[field.valueKey]}
              min={field.min}
              max={field.max}
              onChange={props[field.onChangeKey]}
            />
          ))}
        </SubSection>
      </SurfaceFeatureToggle>
      <SurfaceFeatureToggle
        title={title}
        label="Border"
        checked={borderOn}
        onChange={onBorderOnChange}
        sx={{ mt: 2 }}
      >
        <SubSection sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
      </SurfaceFeatureToggle>
    </Box>
  )
})
