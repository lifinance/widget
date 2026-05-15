import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useThemeMode } from '../../hooks/useThemeMode.js'
import type { ThemeItem } from '../../store/editTools/types.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useThemeValues } from '../../store/widgetConfig/useThemeValues.js'
import {
  EditThemeButton,
  PreviewButton,
  PreviewCard,
  PreviewCardText,
  PreviewHeaderPill,
  SchemeIconSlot,
  SchemeIcons,
  ThemeCard,
  ThemeCardInfo,
  ThemeCardsContainer,
  ThemeName,
  ThemePreview,
} from './ThemeControl.style.js'

interface PreviewColors {
  bg: string
  headerPill: string
  cardBg: string
  cardBorder: string
  cardText: string
  buttonColor: string
  outlineColor: string
}

const defaultPreviewColors: PreviewColors = {
  bg: '#fcfcfc',
  headerPill: '#c0c4cc',
  cardBg: '#ffffff',
  cardBorder: '#dde2eb',
  cardText: '#c0c4cc',
  buttonColor: '#5c67ff',
  outlineColor: '#dde2eb',
}

function extractPreviewColors(themeItem: ThemeItem): PreviewColors {
  if (themeItem.id === 'default') {
    return defaultPreviewColors
  }

  const colorSchemes = themeItem.theme.colorSchemes
  const palette =
    colorSchemes?.light?.palette ||
    colorSchemes?.dark?.palette ||
    Object.values(colorSchemes ?? {})[0]?.palette

  const primary = palette?.primary
  const buttonColor =
    primary &&
    typeof primary === 'object' &&
    'main' in primary &&
    typeof primary.main === 'string'
      ? primary.main
      : '#5c67ff'

  const divider =
    typeof palette?.divider === 'string' ? palette.divider : '#dde2eb'

  const bg =
    typeof palette?.background === 'object' &&
    palette.background &&
    'default' in palette.background &&
    typeof palette.background.default === 'string'
      ? palette.background.default
      : '#fcfcfc'

  const cardBg =
    typeof palette?.background === 'object' &&
    palette.background &&
    'paper' in palette.background &&
    typeof palette.background.paper === 'string'
      ? palette.background.paper
      : '#ffffff'

  const grey =
    palette && 'grey' in palette && typeof palette.grey === 'object'
      ? palette.grey
      : null
  const headerPill =
    grey && typeof grey === 'object' && '300' in grey
      ? String(grey['300'])
      : '#c0c4cc'

  return {
    bg,
    headerPill,
    cardBg,
    cardBorder: divider,
    cardText: headerPill,
    buttonColor,
    outlineColor: divider,
  }
}

interface ThemeControlProps {
  onOpenEditTheme?: () => void
}

export const ThemeControl = ({
  onOpenEditTheme,
}: ThemeControlProps): JSX.Element => {
  const { setConfigTheme, setAppearance } = useConfigActions()
  const { themeMode, setMode } = useThemeMode()
  const { selectedThemeId, allThemesItems } = useThemeValues()
  const { setViewportBackgroundColor } = useEditToolsActions()

  const handleSelectTheme = useCallback(
    (themeItem: ThemeItem): void => {
      const nextThemeMode =
        themeItem.theme.colorSchemes?.[themeMode] !== undefined
          ? themeMode
          : themeItem.theme.colorSchemes?.light
            ? 'light'
            : themeItem.theme.colorSchemes?.dark
              ? 'dark'
              : undefined

      setConfigTheme(themeItem.theme, themeItem.id)
      if (nextThemeMode && nextThemeMode !== themeMode) {
        setAppearance(nextThemeMode)
        setMode(nextThemeMode)
      }
      const resolvedMode = nextThemeMode ?? themeMode
      setViewportBackgroundColor(
        themeItem.theme.colorSchemes?.[resolvedMode]?.palette?.playground?.main,
        resolvedMode
      )
    },
    [
      themeMode,
      setConfigTheme,
      setAppearance,
      setMode,
      setViewportBackgroundColor,
    ]
  )

  return (
    <ThemeCardsContainer>
      {allThemesItems.map((themeItem: ThemeItem) => {
        const isSelected = selectedThemeId === themeItem.id
        const colorSchemeKeys = Object.keys(themeItem.theme.colorSchemes ?? {})
        const supportsLight =
          themeItem.id === 'default' || colorSchemeKeys.includes('light')
        const supportsDark = colorSchemeKeys.includes('dark')
        const displayName = themeItem.name.replace(/\s+Light$/i, '')
        const colors = extractPreviewColors(themeItem)

        return (
          <ThemeCard
            key={themeItem.id}
            selected={isSelected}
            onClick={() => handleSelectTheme(themeItem)}
          >
            <ThemeCardInfo>
              <ThemeName>{displayName}</ThemeName>
              {isSelected ? (
                <EditThemeButton
                  disableRipple
                  onClick={(event) => {
                    event.stopPropagation()
                    onOpenEditTheme?.()
                  }}
                >
                  Edit theme
                </EditThemeButton>
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
            <ThemePreview
              previewOutlineColor={colors.outlineColor}
              sx={{ backgroundColor: colors.bg }}
            >
              <PreviewHeaderPill sx={{ backgroundColor: colors.headerPill }} />
              <PreviewCard
                sx={{
                  backgroundColor: colors.cardBg,
                  border: `0.5px solid ${colors.cardBorder}`,
                }}
              >
                <PreviewCardText sx={{ backgroundColor: colors.cardText }} />
              </PreviewCard>
              <PreviewButton sx={{ backgroundColor: colors.buttonColor }} />
            </ThemePreview>
          </ThemeCard>
        )
      })}
    </ThemeCardsContainer>
  )
}
