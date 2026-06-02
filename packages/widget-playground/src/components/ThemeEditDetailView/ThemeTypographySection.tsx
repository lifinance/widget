import type { JSX } from 'react'
import { TYPOGRAPHY_COLOR_ROWS } from '../../utils/themeEdit.js'
import {
  HelperText,
  SectionDivider,
  SectionHeading,
} from '../DetailView/DetailView.style.js'
import { FontAutocomplete } from '../FontAutocomplete/FontAutocomplete.js'
import { ThemeColorRow } from '../ThemeColorRow.js'
import { ColorRowStack, FontFieldStack } from './ThemeEditDetailView.style.js'

interface ThemeTypographySectionProps {
  colorPath: (suffix: string) => string
}

export const ThemeTypographySection = ({
  colorPath,
}: ThemeTypographySectionProps): JSX.Element => {
  return (
    <>
      <SectionDivider />
      <SectionHeading sx={{ marginTop: 0 }}>Typography</SectionHeading>
      <FontFieldStack>
        <FontAutocomplete />
        <HelperText>
          To use custom fonts, embed them in your project.
        </HelperText>
      </FontFieldStack>
      <ColorRowStack>
        {TYPOGRAPHY_COLOR_ROWS.map(({ label, suffix }) => (
          <ThemeColorRow
            key={suffix}
            label={label}
            colorPath={colorPath(suffix)}
          />
        ))}
      </ColorRowStack>
    </>
  )
}
