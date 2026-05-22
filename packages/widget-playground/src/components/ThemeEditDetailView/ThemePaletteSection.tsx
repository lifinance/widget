import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import type { JSX, SyntheticEvent } from 'react'
import {
  getAccentColorPath,
  PALETTE_COLOR_ROWS,
  type PaletteMode,
} from '../../utils/themeEdit.js'
import { SectionHeading } from '../DetailView/DetailView.style.js'
import { EditableColorRow } from '../EditableColorRow/EditableColorRow.js'
import { RowLabel } from '../Row.style.js'
import { Tab, Tabs } from '../Tabs.style.js'
import { ThemeColorRow } from '../ThemeColorRow.js'
import { ColorRowStack } from './ThemeEditDetailView.style.js'

interface ThemePaletteSectionProps {
  effectivePaletteMode: PaletteMode
  hasBothModes: boolean
  handlePaletteModeChange: (_: SyntheticEvent, value: PaletteMode) => void
  colorPath: (suffix: string) => string
  viewportBackgroundHex: string
  onViewportBackgroundChange: (newHex: string) => void
}

export const ThemePaletteSection = ({
  effectivePaletteMode,
  hasBothModes,
  handlePaletteModeChange,
  colorPath,
  viewportBackgroundHex,
  onViewportBackgroundChange,
}: ThemePaletteSectionProps): JSX.Element => {
  return (
    <>
      <SectionHeading>Color palette</SectionHeading>
      {hasBothModes ? (
        <>
          <RowLabel sx={{ mb: 1 }}>Mode</RowLabel>
          <Tabs
            value={effectivePaletteMode}
            onChange={handlePaletteModeChange}
            aria-label="Palette mode"
            sx={{ marginBottom: 3 }}
          >
            <Tab
              value="light"
              icon={<LightModeIcon sx={{ fontSize: 18 }} />}
              disableRipple
            />
            <Tab
              value="dark"
              icon={<DarkModeIcon sx={{ fontSize: 18 }} />}
              disableRipple
            />
          </Tabs>
        </>
      ) : null}

      <ColorRowStack>
        {PALETTE_COLOR_ROWS.map(({ label, suffix }) => (
          <ThemeColorRow
            key={suffix}
            label={label}
            colorPath={colorPath(suffix)}
          />
        ))}
        <ThemeColorRow
          label="Accent"
          colorPath={getAccentColorPath(effectivePaletteMode)}
        />
        <EditableColorRow
          label="Viewport background"
          hex={viewportBackgroundHex}
          ariaLabel="Viewport background"
          onChange={onViewportBackgroundChange}
        />
      </ColorRowStack>
    </>
  )
}
