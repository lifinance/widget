import type { JSX } from 'react'
import { useResetTheme } from '../../hooks/useResetTheme.js'
import { useThemeEditPalette } from '../../hooks/useThemeEditPalette.js'
import { useThemeSurfaces } from '../../hooks/useThemeSurfaces.js'
import { docsLinks } from '../../utils/docsLinks.js'
import { DetailViewLayout } from '../DetailView/DetailViewLayout.js'
import { SurfaceBlock } from '../SurfaceBlock.js'
import { ThemeSections } from './ThemeEditDetailView.style.js'
import { ThemePaletteSection } from './ThemePaletteSection.js'
import { ThemeTypographySection } from './ThemeTypographySection.js'

interface ThemeEditDetailViewProps {
  onBack: () => void
}

export const ThemeEditDetailView = ({
  onBack,
}: ThemeEditDetailViewProps): JSX.Element => {
  const handleReset = useResetTheme()
  const palette = useThemeEditPalette()
  const surfaces = useThemeSurfaces(palette.effectivePaletteMode)

  return (
    <DetailViewLayout
      onBack={onBack}
      onReset={handleReset}
      resetLabel="Reset theme"
      title="Edit theme"
      description="Set the widget's visual theme and override any colors you need to match your app."
      docsHref={docsLinks.theme}
      variant="sections"
      contentSx={{ gap: 0 }}
    >
      <ThemeSections>
        <ThemePaletteSection {...palette} />
        <ThemeTypographySection colorPath={palette.colorPath} />

        <SurfaceBlock {...surfaces.widget} />
        <SurfaceBlock {...surfaces.card} />
        <SurfaceBlock {...surfaces.button} />
      </ThemeSections>
    </DetailViewLayout>
  )
}
