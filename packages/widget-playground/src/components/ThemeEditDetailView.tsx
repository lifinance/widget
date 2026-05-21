import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import type { CSSObject } from '@mui/material'
import { Box, Divider } from '@mui/material'
import type { JSX, SyntheticEvent } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useThemeMode } from '../hooks/useThemeMode.js'
import { allFonts } from '../providers/FontLoaderProvider/fonts/defaultFonts.js'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import { usePlaygroundSettingValues } from '../store/editTools/usePlaygroundSettingValues.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useConfigColorsFromPath } from '../store/widgetConfig/useConfigValues.js'
import { useThemeValues } from '../store/widgetConfig/useThemeValues.js'
import { useWidgetConfigStore } from '../store/widgetConfig/WidgetConfigProvider.js'
import { safe6DigitHexColor } from '../utils/color.js'
import { docsLinks } from '../utils/docsLinks.js'
import {
  buildBoxShadow,
  mergeComponentRoot,
  parseBoxShadow,
  parseCssBorder,
  pxFromCss,
} from '../utils/theme.js'
import {
  Content,
  Description,
  HelperText,
  SectionHeading,
  Title,
} from './DetailView/DetailView.style.js'
import { DetailViewHeader } from './DetailView/DetailViewHeader.js'
import { DocsLink } from './DocsLink/DocsLink.js'
import { EditableColorRow } from './EditableColorRow/EditableColorRow.js'
import { FontAutocomplete } from './FontAutocomplete/FontAutocomplete.js'
import { RowLabel } from './Row.style.js'
import { SurfaceBlock } from './SurfaceBlock.js'
import { Tab, Tabs } from './Tabs.style.js'

interface ThemeEditDetailViewProps {
  onBack: () => void
}

const PALETTE_LABELS: Array<{ label: string; suffix: string }> = [
  { label: 'Primary color', suffix: 'primary.main' },
  { label: 'Secondary color', suffix: 'secondary.main' },
  { label: 'Widget background', suffix: 'background.default' },
  { label: 'Card background', suffix: 'background.paper' },
  { label: 'Success', suffix: 'success.main' },
  { label: 'Warning', suffix: 'warning.main' },
  { label: 'Error', suffix: 'error.main' },
  { label: 'Accent light', suffix: 'grey.300' },
  { label: 'Accent dark', suffix: 'grey.800' },
]

export const ThemeEditDetailView = ({
  onBack,
}: ThemeEditDetailViewProps): JSX.Element => {
  const {
    setContainer,
    setBorderRadius,
    setBorderRadiusSecondary,
    setConfig,
    setConfigTheme,
    setAppearance,
  } = useConfigActions()
  const { setSelectedFont, setViewportBackgroundColor } = useEditToolsActions()
  const { viewportColorLight, viewportColorDark } = usePlaygroundSettingValues()
  const { themeMode, setMode } = useThemeMode()
  const { selectedThemeItem } = useThemeValues()
  const config = useWidgetConfigStore((s) => s.config)
  const defaultConfig = useWidgetConfigStore((s) => s.defaultConfig)

  const handleReset = useCallback((): void => {
    const defaultTheme = defaultConfig?.theme ?? {}
    setConfigTheme(defaultTheme, 'default')
    setSelectedFont(allFonts[0])
  }, [defaultConfig, setConfigTheme, setSelectedFont])

  const schemeKeys = Object.keys(selectedThemeItem?.theme.colorSchemes ?? {})
  const canLight = schemeKeys.includes('light')
  const canDark = schemeKeys.includes('dark')
  const hasBothModes = canLight && canDark

  const [paletteMode, setPaletteMode] = useState<'light' | 'dark'>(() => {
    if (canLight && canDark) {
      return themeMode
    }
    return canLight ? 'light' : 'dark'
  })

  const effectivePaletteMode: 'light' | 'dark' =
    paletteMode === 'light' && !canLight && canDark
      ? 'dark'
      : paletteMode === 'dark' && !canDark && canLight
        ? 'light'
        : paletteMode

  const handlePaletteModeChange = useCallback(
    (_: SyntheticEvent, value: 'light' | 'dark'): void => {
      setPaletteMode(value)
      setAppearance(value)
      setMode(value)
      setViewportBackgroundColor(
        selectedThemeItem?.theme.colorSchemes?.[value]?.palette?.playground
          ?.main || (value === 'dark' ? '#000000' : '#F5F5F5'),
        value
      )
    },
    [setAppearance, setMode, setViewportBackgroundColor, selectedThemeItem]
  )

  const colorPath = useCallback(
    (suffix: string): string =>
      `theme.colorSchemes.${effectivePaletteMode}.palette.${suffix}`,
    [effectivePaletteMode]
  )

  const themeSnapshot = config?.theme
  const container = themeSnapshot?.container ?? {}
  const shape = themeSnapshot?.shape ?? {}
  const muiCardRoot = themeSnapshot?.components?.MuiCard?.styleOverrides?.root
  const muiButtonRoot =
    themeSnapshot?.components?.MuiButton?.styleOverrides?.root
  const cardRootObj =
    muiCardRoot &&
    typeof muiCardRoot === 'object' &&
    !Array.isArray(muiCardRoot)
      ? (muiCardRoot as CSSObject)
      : {}
  const buttonRootObj =
    muiButtonRoot &&
    typeof muiButtonRoot === 'object' &&
    !Array.isArray(muiButtonRoot)
      ? (muiButtonRoot as CSSObject)
      : {}

  const borderRadiusCard = shape.borderRadius ?? 8
  const borderRadiusButton = shape.borderRadiusSecondary ?? 8

  const widgetRadius = pxFromCss(container.borderRadius, 16)
  const widgetShadowStr =
    typeof container.boxShadow === 'string' ? container.boxShadow : ''
  const widgetShadowOn =
    !!widgetShadowStr &&
    widgetShadowStr !== 'none' &&
    widgetShadowStr.length > 0
  const widgetShadowParsed = widgetShadowOn
    ? parseBoxShadow(widgetShadowStr)
    : { offsetX: 0, offsetY: 8, blur: 32, spread: 0 }
  const widgetShadowOffsetX = widgetShadowParsed.offsetX
  const widgetShadowOffsetY = widgetShadowParsed.offsetY
  const widgetShadowBlur = widgetShadowParsed.blur
  const widgetShadowSpread = widgetShadowParsed.spread

  const borderParsed = parseCssBorder(container.border as string | undefined)
  const widgetBorderOn = borderParsed.on

  const cardShadowStr =
    typeof cardRootObj.boxShadow === 'string' ? cardRootObj.boxShadow : ''
  const cardShadowOn =
    !!cardShadowStr && cardShadowStr !== 'none' && cardShadowStr.length > 0
  const cardShadowParsed = cardShadowOn
    ? parseBoxShadow(cardShadowStr)
    : { offsetX: 0, offsetY: 8, blur: 4, spread: 0 }
  const cardShadowOffsetX = cardShadowParsed.offsetX
  const cardShadowOffsetY = cardShadowParsed.offsetY
  const cardShadowBlur = cardShadowParsed.blur
  const cardShadowSpread = cardShadowParsed.spread
  const cardBorderFallbackColor = safe6DigitHexColor(
    (effectivePaletteMode === 'dark'
      ? themeSnapshot?.colorSchemes?.dark?.palette?.grey?.[800]
      : themeSnapshot?.colorSchemes?.light?.palette?.grey?.[300]) ?? '#E5E7EB'
  )
  const muiCard = themeSnapshot?.components?.MuiCard
  const cardBorderFromRoot = parseCssBorder(
    cardRootObj.border as string | undefined
  )
  const cardVariantsEdited = muiCard?.variants?.length === 0
  const cardBorderExplicitlyOff =
    cardRootObj.border === 'none' ||
    cardRootObj.borderWidth === 0 ||
    cardRootObj.borderWidth === '0' ||
    cardRootObj.borderWidth === '0px'
  const cardBorderOn =
    cardBorderFromRoot.on ||
    (!cardVariantsEdited &&
      !cardBorderExplicitlyOff &&
      (muiCard?.defaultProps?.variant ?? 'outlined') === 'outlined')
  const cardBorderParsed = {
    on: cardBorderOn,
    width: cardBorderFromRoot.on ? cardBorderFromRoot.width : 1,
    color: cardBorderFromRoot.on
      ? cardBorderFromRoot.color
      : cardBorderFallbackColor,
  }

  const buttonShadowStr =
    typeof buttonRootObj.boxShadow === 'string' ? buttonRootObj.boxShadow : ''
  const buttonShadowOn =
    !!buttonShadowStr &&
    buttonShadowStr !== 'none' &&
    buttonShadowStr.length > 0
  const buttonShadowParsed = buttonShadowOn
    ? parseBoxShadow(buttonShadowStr)
    : { offsetX: 0, offsetY: 8, blur: 4, spread: 0 }
  const buttonShadowOffsetX = buttonShadowParsed.offsetX
  const buttonShadowOffsetY = buttonShadowParsed.offsetY
  const buttonShadowBlur = buttonShadowParsed.blur
  const buttonShadowSpread = buttonShadowParsed.spread
  const buttonBorderParsed = parseCssBorder(
    buttonRootObj.border as string | undefined
  )

  const configRef = useRef(config)
  configRef.current = config

  const updateContainer = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const current = configRef.current?.theme?.container ?? {}
      setContainer({
        ...current,
        ...patch,
      })
    },
    [setContainer]
  )

  const updateCardComponent = useCallback(
    (patch: CSSObject): void => {
      setConfig(mergeComponentRoot(configRef.current, 'MuiCard', patch))
    },
    [setConfig]
  )

  const updateButtonComponent = useCallback(
    (patch: CSSObject): void => {
      setConfig(mergeComponentRoot(configRef.current, 'MuiButton', patch))
    },
    [setConfig]
  )

  return (
    <>
      <DetailViewHeader onBack={onBack} onReset={handleReset} />
      <Content sx={{ gap: 0 }}>
        <Title sx={{ mb: 1 }}>Edit theme</Title>
        <Description sx={{ mb: 3 }}>
          Set the widget&apos;s visual theme and override any colors you need to
          match your app.
        </Description>
        <DocsLink href={docsLinks.theme} />

        <Box sx={{ my: 4 }}>
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

          {PALETTE_LABELS.map(({ label, suffix }) => (
            <ThemeColorRow
              key={suffix}
              label={label}
              colorPath={colorPath(suffix)}
            />
          ))}
          <EditableColorRow
            label="Viewport background"
            hex={safe6DigitHexColor(
              (effectivePaletteMode === 'dark'
                ? viewportColorDark
                : viewportColorLight) ||
                (effectivePaletteMode === 'dark' ? '#000000' : '#F5F5F5')
            ).toUpperCase()}
            ariaLabel="Viewport background"
            onChange={(newHex) =>
              setViewportBackgroundColor(newHex, effectivePaletteMode)
            }
          />

          <Box>
            <Divider sx={{ my: '40px' }} />
            <SectionHeading sx={{ marginTop: 0 }}>Typography</SectionHeading>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                mb: 3,
              }}
            >
              <FontAutocomplete />
              <HelperText>
                To use custom fonts, embed them in your project.
              </HelperText>
            </Box>
            <ThemeColorRow
              label="Text primary"
              colorPath={colorPath('text.primary')}
            />
            <ThemeColorRow
              label="Text secondary"
              colorPath={colorPath('text.secondary')}
            />
          </Box>

          <SurfaceBlock
            title="Widget"
            radius={widgetRadius}
            onRadiusChange={(n) => updateContainer({ borderRadius: `${n}px` })}
            radiusMax={32}
            shadowOn={widgetShadowOn}
            onShadowOnChange={(on) =>
              updateContainer({
                boxShadow: on
                  ? buildBoxShadow(
                      widgetShadowOffsetX,
                      widgetShadowOffsetY,
                      widgetShadowBlur,
                      widgetShadowSpread
                    )
                  : 'none',
              })
            }
            shadowOffsetX={widgetShadowOffsetX}
            onShadowOffsetXChange={(x) =>
              updateContainer({
                boxShadow: widgetShadowOn
                  ? buildBoxShadow(
                      x,
                      widgetShadowOffsetY,
                      widgetShadowBlur,
                      widgetShadowSpread
                    )
                  : 'none',
              })
            }
            shadowOffsetY={widgetShadowOffsetY}
            onShadowOffsetYChange={(y) =>
              updateContainer({
                boxShadow: widgetShadowOn
                  ? buildBoxShadow(
                      widgetShadowOffsetX,
                      y,
                      widgetShadowBlur,
                      widgetShadowSpread
                    )
                  : 'none',
              })
            }
            shadowBlur={widgetShadowBlur}
            onShadowBlurChange={(blur) =>
              updateContainer({
                boxShadow: widgetShadowOn
                  ? buildBoxShadow(
                      widgetShadowOffsetX,
                      widgetShadowOffsetY,
                      blur,
                      widgetShadowSpread
                    )
                  : 'none',
              })
            }
            shadowSpread={widgetShadowSpread}
            onShadowSpreadChange={(spread) =>
              updateContainer({
                boxShadow: widgetShadowOn
                  ? buildBoxShadow(
                      widgetShadowOffsetX,
                      widgetShadowOffsetY,
                      widgetShadowBlur,
                      spread
                    )
                  : 'none',
              })
            }
            borderOn={widgetBorderOn}
            onBorderOnChange={(on) =>
              updateContainer({
                border: on
                  ? `${borderParsed.width}px solid ${borderParsed.color}`
                  : undefined,
              })
            }
            borderColor={borderParsed.color}
            onBorderColorChange={(hex) =>
              updateContainer({
                border: widgetBorderOn
                  ? `${borderParsed.width}px solid ${hex}`
                  : undefined,
              })
            }
            borderWeight={borderParsed.width}
            onBorderWeightChange={(w) =>
              updateContainer({
                border: widgetBorderOn
                  ? `${w}px solid ${borderParsed.color}`
                  : undefined,
              })
            }
          />

          <SurfaceBlock
            title="Card"
            radius={borderRadiusCard}
            onRadiusChange={(n) => setBorderRadius(n)}
            radiusMax={24}
            shadowOn={cardShadowOn}
            onShadowOnChange={(on) =>
              updateCardComponent({
                boxShadow: on
                  ? buildBoxShadow(
                      cardShadowOffsetX,
                      cardShadowOffsetY,
                      cardShadowBlur,
                      cardShadowSpread
                    )
                  : 'none',
              })
            }
            shadowOffsetX={cardShadowOffsetX}
            onShadowOffsetXChange={(x) =>
              updateCardComponent({
                boxShadow: cardShadowOn
                  ? buildBoxShadow(
                      x,
                      cardShadowOffsetY,
                      cardShadowBlur,
                      cardShadowSpread
                    )
                  : 'none',
              })
            }
            shadowOffsetY={cardShadowOffsetY}
            onShadowOffsetYChange={(y) =>
              updateCardComponent({
                boxShadow: cardShadowOn
                  ? buildBoxShadow(
                      cardShadowOffsetX,
                      y,
                      cardShadowBlur,
                      cardShadowSpread
                    )
                  : 'none',
              })
            }
            shadowBlur={cardShadowBlur}
            onShadowBlurChange={(blur) =>
              updateCardComponent({
                boxShadow: cardShadowOn
                  ? buildBoxShadow(
                      cardShadowOffsetX,
                      cardShadowOffsetY,
                      blur,
                      cardShadowSpread
                    )
                  : 'none',
              })
            }
            shadowSpread={cardShadowSpread}
            onShadowSpreadChange={(spread) =>
              updateCardComponent({
                boxShadow: cardShadowOn
                  ? buildBoxShadow(
                      cardShadowOffsetX,
                      cardShadowOffsetY,
                      cardShadowBlur,
                      spread
                    )
                  : 'none',
              })
            }
            borderOn={cardBorderParsed.on}
            onBorderOnChange={(on) =>
              updateCardComponent({
                border: on
                  ? `${cardBorderParsed.width}px solid ${cardBorderParsed.color}`
                  : 'none',
              })
            }
            borderColor={cardBorderParsed.color}
            onBorderColorChange={(hex) =>
              updateCardComponent({
                border: cardBorderParsed.on
                  ? `${cardBorderParsed.width}px solid ${hex}`
                  : 'none',
              })
            }
            borderWeight={cardBorderParsed.width}
            onBorderWeightChange={(w) =>
              updateCardComponent({
                border: cardBorderParsed.on
                  ? `${w}px solid ${cardBorderParsed.color}`
                  : 'none',
              })
            }
          />

          <SurfaceBlock
            title="Button"
            radius={borderRadiusButton}
            onRadiusChange={(n) => setBorderRadiusSecondary(n)}
            radiusMax={24}
            shadowOn={buttonShadowOn}
            onShadowOnChange={(on) =>
              updateButtonComponent({
                boxShadow: on
                  ? buildBoxShadow(
                      buttonShadowOffsetX,
                      buttonShadowOffsetY,
                      buttonShadowBlur,
                      buttonShadowSpread
                    )
                  : 'none',
              })
            }
            shadowOffsetX={buttonShadowOffsetX}
            onShadowOffsetXChange={(x) =>
              updateButtonComponent({
                boxShadow: buttonShadowOn
                  ? buildBoxShadow(
                      x,
                      buttonShadowOffsetY,
                      buttonShadowBlur,
                      buttonShadowSpread
                    )
                  : 'none',
              })
            }
            shadowOffsetY={buttonShadowOffsetY}
            onShadowOffsetYChange={(y) =>
              updateButtonComponent({
                boxShadow: buttonShadowOn
                  ? buildBoxShadow(
                      buttonShadowOffsetX,
                      y,
                      buttonShadowBlur,
                      buttonShadowSpread
                    )
                  : 'none',
              })
            }
            shadowBlur={buttonShadowBlur}
            onShadowBlurChange={(blur) =>
              updateButtonComponent({
                boxShadow: buttonShadowOn
                  ? buildBoxShadow(
                      buttonShadowOffsetX,
                      buttonShadowOffsetY,
                      blur,
                      buttonShadowSpread
                    )
                  : 'none',
              })
            }
            shadowSpread={buttonShadowSpread}
            onShadowSpreadChange={(spread) =>
              updateButtonComponent({
                boxShadow: buttonShadowOn
                  ? buildBoxShadow(
                      buttonShadowOffsetX,
                      buttonShadowOffsetY,
                      buttonShadowBlur,
                      spread
                    )
                  : 'none',
              })
            }
            borderOn={buttonBorderParsed.on}
            onBorderOnChange={(on) =>
              updateButtonComponent({
                border: on
                  ? `${buttonBorderParsed.width}px solid ${buttonBorderParsed.color}`
                  : 'none',
              })
            }
            borderColor={buttonBorderParsed.color}
            onBorderColorChange={(hex) =>
              updateButtonComponent({
                border: buttonBorderParsed.on
                  ? `${buttonBorderParsed.width}px solid ${hex}`
                  : 'none',
              })
            }
            borderWeight={buttonBorderParsed.width}
            onBorderWeightChange={(w) =>
              updateButtonComponent({
                border: buttonBorderParsed.on
                  ? `${w}px solid ${buttonBorderParsed.color}`
                  : 'none',
              })
            }
          />
        </Box>
      </Content>
    </>
  )
}

interface ThemeColorRowProps {
  label: string
  colorPath: string
}

const ThemeColorRow = ({
  label,
  colorPath,
}: ThemeColorRowProps): JSX.Element | null => {
  const [colorValue] = useConfigColorsFromPath(colorPath)
  const { setColor } = useConfigActions()

  if (!colorValue) {
    return null
  }

  const hex = safe6DigitHexColor(colorValue).toUpperCase()

  return (
    <EditableColorRow
      label={label}
      hex={hex}
      ariaLabel={label}
      onChange={(newHex) => setColor(colorPath, newHex)}
    />
  )
}
