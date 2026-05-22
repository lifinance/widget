import type { JSX } from 'react'
import type { PreviewColors } from '../../utils/themePreview.js'
import {
  PreviewButton,
  PreviewCard,
  PreviewCardText,
  PreviewHeaderPill,
  PreviewRoot,
} from './ThemePreviewMock.style.js'

interface ThemePreviewMockProps {
  colors: PreviewColors
}

export const ThemePreviewMock = ({
  colors,
}: ThemePreviewMockProps): JSX.Element => {
  return (
    <PreviewRoot bgColor={colors.bg} outlineColor={colors.outlineColor}>
      <PreviewHeaderPill pillColor={colors.headerPill} />
      <PreviewCard cardBg={colors.cardBg} cardBorder={colors.cardBorder}>
        <PreviewCardText textColor={colors.cardText} />
      </PreviewCard>
      <PreviewButton buttonColor={colors.buttonColor} />
    </PreviewRoot>
  )
}
