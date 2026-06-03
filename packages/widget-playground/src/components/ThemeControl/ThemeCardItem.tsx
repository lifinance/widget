import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import type { FC, JSX, KeyboardEvent } from 'react'
import { memo, useCallback } from 'react'
import type { ThemeItem } from '../../store/editTools/types.js'
import {
  stripThemeNameSuffix,
  themeItemSupportsDark,
  themeItemSupportsLight,
} from '../../utils/themeEdit.js'
import { extractPreviewColors } from '../../utils/themePreview.js'
import {
  EditThemeAction,
  SchemeIconSlot,
  SchemeIcons,
  ThemeCard,
  ThemeCardInfo,
  ThemeName,
} from './ThemeControl.style.js'
import { ThemePreviewMock } from './ThemePreviewMock.js'

interface ThemeCardItemProps {
  themeItem: ThemeItem
  isSelected: boolean
  onSelect: (themeItem: ThemeItem) => void
  onOpenEditTheme?: () => void
}

export const ThemeCardItem: FC<ThemeCardItemProps> = memo(
  function ThemeCardItem({
    themeItem,
    isSelected,
    onSelect,
    onOpenEditTheme,
  }: ThemeCardItemProps): JSX.Element {
    const displayName = stripThemeNameSuffix(themeItem.name)
    const colors = extractPreviewColors(themeItem)
    const supportsLight = themeItemSupportsLight(themeItem)
    const supportsDark = themeItemSupportsDark(themeItem)

    const handleEditThemeKeyDown = useCallback(
      (event: KeyboardEvent<HTMLSpanElement>): void => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          event.stopPropagation()
          onOpenEditTheme?.()
        }
      },
      [onOpenEditTheme]
    )

    return (
      <ThemeCard
        type="button"
        disableRipple
        selected={isSelected}
        aria-label={`Select ${displayName} theme`}
        aria-pressed={isSelected}
        onClick={() => onSelect(themeItem)}
      >
        <ThemeCardInfo>
          <ThemeName>{displayName}</ThemeName>
          {isSelected ? (
            <EditThemeAction
              role="button"
              tabIndex={0}
              aria-label={`Edit ${displayName} theme`}
              onClick={(event) => {
                event.stopPropagation()
                onOpenEditTheme?.()
              }}
              onKeyDown={handleEditThemeKeyDown}
            >
              Edit theme
            </EditThemeAction>
          ) : (
            <SchemeIcons>
              {supportsLight ? (
                <SchemeIconSlot>
                  <LightModeOutlinedIcon />
                </SchemeIconSlot>
              ) : null}
              {supportsDark ? (
                <SchemeIconSlot>
                  <DarkModeOutlinedIcon />
                </SchemeIconSlot>
              ) : null}
            </SchemeIcons>
          )}
        </ThemeCardInfo>
        <ThemePreviewMock colors={colors} />
      </ThemeCard>
    )
  }
)
