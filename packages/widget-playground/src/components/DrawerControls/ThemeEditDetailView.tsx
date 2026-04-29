import type { WidgetConfig } from '@lifi/widget'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import type { CSSObject } from '@mui/material'
import {
  Box,
  Divider,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useState } from 'react'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useThemeValues } from '../../store/widgetConfig/useThemeValues.js'
import { useWidgetConfigStore } from '../../store/widgetConfig/WidgetConfigProvider.js'
import { safe6DigitHexColor } from '../../utils/color.js'
import { getValueFromPath } from '../../utils/getValueFromPath.js'
import { Switch } from '../Switch.js'
import {
  CapitalizeFirstLetter,
  ColorInput,
} from './DesignControls/DesignControls.style.js'
import { DetailViewHeader } from './DetailViewHeader.js'
import {
  Content,
  HexLabel,
  ModeToggleBox,
  PageDescription,
  PageTitle,
  Row,
  RowLabel,
  RowValue,
  SectionHeading,
  SubRow,
  SubSection,
} from './ThemeEditDetailView.style.js'

function pxFromCss(
  value: string | number | undefined,
  fallback: number
): number {
  if (value === undefined || value === '') {
    return fallback
  }
  if (typeof value === 'number') {
    return value
  }
  const n = Number.parseInt(String(value).replace(/px/g, '').trim(), 10)
  return Number.isFinite(n) ? n : fallback
}

function buildBoxShadow(blur: number): string {
  return `0px 8px ${blur}px rgba(0, 0, 0, 0.12)`
}

function parseBoxShadowBlur(boxShadow: string): number {
  const px = boxShadow.match(/\d+px/g)
  if (px && px.length >= 3) {
    return Number.parseInt(px[2], 10)
  }
  return 32
}

function parseCssBorder(border: string | number | undefined): {
  on: boolean
  width: number
  color: string
} {
  if (border === undefined || border === '' || border === 'none') {
    return { on: false, width: 1, color: '#E5E7EB' }
  }
  const s = String(border).trim()
  const wMatch = s.match(/^(\d+(?:\.\d+)?)px/)
  const width = wMatch ? Math.max(1, Math.round(Number(wMatch[1]))) : 1
  const colorMatch = s.match(/solid\s+(.+)$/i)
  let color = '#E5E7EB'
  if (colorMatch?.[1]) {
    const c = colorMatch[1].trim()
    if (c.startsWith('#')) {
      color = safe6DigitHexColor(c)
    }
  }
  return { on: true, width, color }
}

function mergeComponentRoot(
  config: Partial<WidgetConfig> | undefined,
  componentName: 'MuiCard' | 'MuiButton',
  patch: CSSObject
): Partial<WidgetConfig> {
  const theme = config?.theme
  const existing = theme?.components?.[componentName]
  const styleOverrides = existing?.styleOverrides
  const root = styleOverrides?.root
  const prevRoot =
    root && typeof root === 'object' && !Array.isArray(root)
      ? (root as CSSObject)
      : {}

  return {
    theme: {
      ...theme,
      components: {
        ...theme?.components,
        [componentName]: {
          ...existing,
          styleOverrides: {
            ...styleOverrides,
            root: {
              ...prevRoot,
              ...patch,
            },
          },
        },
      },
    },
  }
}

interface ThemeEditDetailViewProps {
  onBack: () => void
  onReset: () => void
}

const PALETTE_LABELS: Array<{ label: string; suffix: string }> = [
  { label: 'Primary', suffix: 'primary.main' },
  { label: 'Secondary', suffix: 'secondary.main' },
  { label: 'Background', suffix: 'background.default' },
  { label: 'Paper', suffix: 'background.paper' },
  { label: 'Success', suffix: 'success.main' },
  { label: 'Warning', suffix: 'warning.main' },
  { label: 'Error', suffix: 'error.main' },
]

export const ThemeEditDetailView = ({
  onBack,
  onReset,
}: ThemeEditDetailViewProps): JSX.Element => {
  const {
    setColor,
    setContainer,
    setBorderRadius,
    setBorderRadiusSecondary,
    setConfig,
  } = useConfigActions()
  const { selectedThemeItem } = useThemeValues()
  const config = useWidgetConfigStore((s) => s.config)

  const schemeKeys = Object.keys(selectedThemeItem?.theme.colorSchemes ?? {})
  const canLight = schemeKeys.includes('light')
  const canDark = schemeKeys.includes('dark')

  const [paletteMode, setPaletteMode] = useState<'light' | 'dark'>(() =>
    canLight ? 'light' : 'dark'
  )

  const effectivePaletteMode: 'light' | 'dark' =
    paletteMode === 'light' && !canLight && canDark
      ? 'dark'
      : paletteMode === 'dark' && !canDark && canLight
        ? 'light'
        : paletteMode

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

  const widgetBg =
    (typeof container.backgroundColor === 'string' &&
      container.backgroundColor) ||
    '#FFFFFF'
  const widgetRadius = pxFromCss(container.borderRadius, 16)
  const widgetShadowStr =
    typeof container.boxShadow === 'string' ? container.boxShadow : ''
  const widgetShadowOn =
    !!widgetShadowStr &&
    widgetShadowStr !== 'none' &&
    widgetShadowStr.length > 0
  const widgetShadowBlur = widgetShadowOn
    ? parseBoxShadowBlur(widgetShadowStr)
    : 32

  const borderParsed = parseCssBorder(container.border as string | undefined)
  const widgetBorderOn = borderParsed.on

  const cardBg =
    (typeof cardRootObj.backgroundColor === 'string' &&
      cardRootObj.backgroundColor) ||
    '#FFFFFF'
  const cardShadowStr =
    typeof cardRootObj.boxShadow === 'string' ? cardRootObj.boxShadow : ''
  const cardShadowOn =
    !!cardShadowStr && cardShadowStr !== 'none' && cardShadowStr.length > 0
  const cardShadowBlur = cardShadowOn ? parseBoxShadowBlur(cardShadowStr) : 4
  const cardBorderParsed = parseCssBorder(
    cardRootObj.border as string | undefined
  )

  const buttonBg =
    (typeof buttonRootObj.backgroundColor === 'string' &&
      buttonRootObj.backgroundColor) ||
    '#FFFFFF'
  const buttonShadowStr =
    typeof buttonRootObj.boxShadow === 'string' ? buttonRootObj.boxShadow : ''
  const buttonShadowOn =
    !!buttonShadowStr &&
    buttonShadowStr !== 'none' &&
    buttonShadowStr.length > 0
  const buttonShadowBlur = buttonShadowOn
    ? parseBoxShadowBlur(buttonShadowStr)
    : 4
  const buttonBorderParsed = parseCssBorder(
    buttonRootObj.border as string | undefined
  )

  const updateContainer = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      setContainer({
        ...container,
        ...patch,
      })
    },
    [container, setContainer]
  )

  const updateCardComponent = useCallback(
    (patch: CSSObject): void => {
      setConfig(mergeComponentRoot(config, 'MuiCard', patch))
    },
    [config, setConfig]
  )

  const updateButtonComponent = useCallback(
    (patch: CSSObject): void => {
      setConfig(mergeComponentRoot(config, 'MuiButton', patch))
    },
    [config, setConfig]
  )

  return (
    <>
      <DetailViewHeader onBack={onBack} onReset={onReset} />
      <Content>
        <PageTitle>Edit theme</PageTitle>
        <PageDescription>
          Set the widget&apos;s visual theme and override any colors you need to
          match your app.
        </PageDescription>

        <SectionHeading>Color palette</SectionHeading>
        <ModeToggleBox>
          <ToggleButtonGroup
            exclusive
            value={effectivePaletteMode}
            onChange={(_, value: 'light' | 'dark' | null) => {
              if (value === 'light' || value === 'dark') {
                setPaletteMode(value)
              }
            }}
            aria-label="Palette mode"
          >
            <ToggleButton
              value="light"
              disabled={!canLight}
              aria-label="Light palette"
            >
              <LightModeOutlinedIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Light
            </ToggleButton>
            <ToggleButton
              value="dark"
              disabled={!canDark}
              aria-label="Dark palette"
            >
              <DarkModeOutlinedIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Dark
            </ToggleButton>
          </ToggleButtonGroup>
        </ModeToggleBox>

        {PALETTE_LABELS.map(({ label, suffix }) => (
          <PaletteColorRow
            key={suffix}
            label={`${label} color`}
            colorPath={colorPath(suffix)}
            setColor={setColor}
          />
        ))}

        <SurfaceBlock
          title="Widget"
          surfaceColor={safe6DigitHexColor(widgetBg).toUpperCase()}
          onSurfaceColorChange={(hex) =>
            updateContainer({ backgroundColor: hex })
          }
          radius={widgetRadius}
          onRadiusChange={(n) => updateContainer({ borderRadius: `${n}px` })}
          radiusMax={32}
          shadowOn={widgetShadowOn}
          onShadowOnChange={(on) =>
            updateContainer({
              boxShadow: on ? buildBoxShadow(widgetShadowBlur) : 'none',
            })
          }
          shadowBlur={widgetShadowBlur}
          onShadowBlurChange={(blur) =>
            updateContainer({
              boxShadow: widgetShadowOn ? buildBoxShadow(blur) : 'none',
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
          surfaceColor={safe6DigitHexColor(cardBg).toUpperCase()}
          onSurfaceColorChange={(hex) =>
            updateCardComponent({ backgroundColor: hex })
          }
          radius={borderRadiusCard}
          onRadiusChange={(n) => setBorderRadius(n)}
          radiusMax={24}
          shadowOn={cardShadowOn}
          onShadowOnChange={(on) =>
            updateCardComponent({
              boxShadow: on ? buildBoxShadow(cardShadowBlur) : 'none',
            })
          }
          shadowBlur={cardShadowBlur}
          onShadowBlurChange={(blur) =>
            updateCardComponent({
              boxShadow: cardShadowOn ? buildBoxShadow(blur) : 'none',
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
          surfaceColor={safe6DigitHexColor(buttonBg).toUpperCase()}
          onSurfaceColorChange={(hex) =>
            updateButtonComponent({ backgroundColor: hex })
          }
          radius={borderRadiusButton}
          onRadiusChange={(n) => setBorderRadiusSecondary(n)}
          radiusMax={24}
          shadowOn={buttonShadowOn}
          onShadowOnChange={(on) =>
            updateButtonComponent({
              boxShadow: on ? buildBoxShadow(buttonShadowBlur) : 'none',
            })
          }
          shadowBlur={buttonShadowBlur}
          onShadowBlurChange={(blur) =>
            updateButtonComponent({
              boxShadow: buttonShadowOn ? buildBoxShadow(blur) : 'none',
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
      </Content>
    </>
  )
}

interface PaletteColorRowProps {
  label: string
  colorPath: string
  setColor: (path: string, color: string) => void
}

const PaletteColorRow = ({
  label,
  colorPath,
  setColor,
}: PaletteColorRowProps): JSX.Element => {
  const raw = useWidgetConfigStore((s) =>
    getValueFromPath<string>(s.config, colorPath)
  )
  const colorValue = raw ?? '#000000'
  const hex = safe6DigitHexColor(colorValue).toUpperCase()

  return (
    <Row>
      <RowLabel>
        <CapitalizeFirstLetter>{label}</CapitalizeFirstLetter>
      </RowLabel>
      <RowValue>
        <HexLabel>{hex}</HexLabel>
        <ColorInput
          aria-label={label}
          type="color"
          value={safe6DigitHexColor(colorValue)}
          onChange={(e) => setColor(colorPath, e.target.value)}
        />
      </RowValue>
    </Row>
  )
}

interface SurfaceBlockProps {
  title: string
  surfaceColor: string
  onSurfaceColorChange: (hex: string) => void
  radius: number
  onRadiusChange: (n: number) => void
  radiusMax: number
  shadowOn: boolean
  onShadowOnChange: (on: boolean) => void
  shadowBlur: number
  onShadowBlurChange: (blur: number) => void
  borderOn: boolean
  onBorderOnChange: (on: boolean) => void
  borderColor: string
  onBorderColorChange: (hex: string) => void
  borderWeight: number
  onBorderWeightChange: (w: number) => void
}

const SurfaceBlock = ({
  title,
  surfaceColor,
  onSurfaceColorChange,
  radius,
  onRadiusChange,
  radiusMax,
  shadowOn,
  onShadowOnChange,
  shadowBlur,
  onShadowBlurChange,
  borderOn,
  onBorderOnChange,
  borderColor,
  onBorderColorChange,
  borderWeight,
  onBorderWeightChange,
}: SurfaceBlockProps): JSX.Element => {
  return (
    <Box sx={{ pb: 2 }}>
      <SectionHeading>{title}</SectionHeading>
      <Row>
        <RowLabel>Color</RowLabel>
        <RowValue>
          <HexLabel>{surfaceColor}</HexLabel>
          <ColorInput
            aria-label={`${title} color`}
            type="color"
            value={safe6DigitHexColor(surfaceColor)}
            onChange={(e) => onSurfaceColorChange(e.target.value)}
          />
        </RowValue>
      </Row>
      <Row sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
        <RowLabel>Corner radius</RowLabel>
        <RowValue sx={{ flex: '1 1 160px', maxWidth: 220 }}>
          <Slider
            size="small"
            value={radius}
            min={0}
            max={radiusMax}
            onChange={(_, v) => onRadiusChange(v as number)}
            valueLabelDisplay="auto"
            aria-label={`${title} corner radius`}
          />
        </RowValue>
        <HexLabel sx={{ minWidth: 24 }}>{radius}</HexLabel>
      </Row>
      <Row>
        <RowLabel>Shadow</RowLabel>
        <RowValue>
          <Switch
            checked={shadowOn}
            onChange={(_, c) => onShadowOnChange(c)}
            aria-label={`${title} shadow`}
          />
        </RowValue>
      </Row>
      {shadowOn ? (
        <SubSection>
          <SubRow>
            <RowLabel>Blur</RowLabel>
            <RowValue sx={{ flex: 1, maxWidth: 200 }}>
              <Slider
                size="small"
                value={shadowBlur}
                min={0}
                max={48}
                onChange={(_, v) => onShadowBlurChange(v as number)}
                aria-label={`${title} shadow blur`}
              />
            </RowValue>
            <HexLabel>{shadowBlur}</HexLabel>
          </SubRow>
        </SubSection>
      ) : null}
      <Row>
        <RowLabel>Border</RowLabel>
        <RowValue>
          <Switch
            checked={borderOn}
            onChange={(_, c) => onBorderOnChange(c)}
            aria-label={`${title} border`}
          />
        </RowValue>
      </Row>
      {borderOn ? (
        <SubSection>
          <SubRow>
            <RowLabel>Color</RowLabel>
            <RowValue>
              <HexLabel>
                {safe6DigitHexColor(borderColor).toUpperCase()}
              </HexLabel>
              <ColorInput
                aria-label={`${title} border color`}
                type="color"
                value={safe6DigitHexColor(borderColor)}
                onChange={(e) => onBorderColorChange(e.target.value)}
              />
            </RowValue>
          </SubRow>
          <SubRow sx={{ flexWrap: 'wrap' }}>
            <RowLabel>Weight</RowLabel>
            <RowValue sx={{ flex: '1 1 120px', maxWidth: 180 }}>
              <Slider
                size="small"
                value={borderWeight}
                min={1}
                max={4}
                step={1}
                marks
                onChange={(_, v) => onBorderWeightChange(v as number)}
                aria-label={`${title} border weight`}
              />
            </RowValue>
            <HexLabel sx={{ minWidth: 16 }}>{borderWeight}</HexLabel>
          </SubRow>
        </SubSection>
      ) : null}
      <Divider sx={{ mt: 1 }} />
    </Box>
  )
}
