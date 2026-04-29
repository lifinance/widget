import type { WidgetConfig } from '@lifi/widget'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LineWeightOutlinedIcon from '@mui/icons-material/LineWeightOutlined'
import type { CSSObject } from '@mui/material'
import { Box, Divider } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useThemeValues } from '../../store/widgetConfig/useThemeValues.js'
import { useWidgetConfigStore } from '../../store/widgetConfig/WidgetConfigProvider.js'
import { safe6DigitHexColor } from '../../utils/color.js'
import { getValueFromPath } from '../../utils/getValueFromPath.js'
import { Switch } from '../Switch.js'
import { CapitalizeFirstLetter } from './DesignControls/DesignControls.style.js'
import {
  MethodTab,
  MethodTabs,
} from './DesignControls/FormValuesControls.style.js'
import { DetailViewHeader } from './DetailViewHeader.js'
import {
  ColorSwatch,
  Content,
  HexLabel,
  PageDescription,
  PageTitle,
  Row,
  RowLabel,
  RowValue,
  SectionHeading,
  SliderRow,
  SliderValueInput,
  SubRow,
  SubSection,
  ThemeSlider,
  ToggleRow,
  ToggleRowLabel,
  ValueInput,
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

function buildBoxShadow(blur: number, spread: number): string {
  return `0px 8px ${blur}px ${spread}px rgba(0, 0, 0, 0.12)`
}

function parseBoxShadow(boxShadow: string): { blur: number; spread: number } {
  const px = boxShadow.match(/-?\d+px/g)
  if (px && px.length >= 4) {
    return {
      blur: Math.max(0, Number.parseInt(px[2], 10)),
      spread: Number.parseInt(px[3], 10),
    }
  }
  if (px && px.length >= 3) {
    return { blur: Math.max(0, Number.parseInt(px[2], 10)), spread: 0 }
  }
  return { blur: 32, spread: 0 }
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
  const widgetShadowParsed = widgetShadowOn
    ? parseBoxShadow(widgetShadowStr)
    : { blur: 32, spread: 0 }
  const widgetShadowBlur = widgetShadowParsed.blur
  const widgetShadowSpread = widgetShadowParsed.spread

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
  const cardShadowParsed = cardShadowOn
    ? parseBoxShadow(cardShadowStr)
    : { blur: 4, spread: 0 }
  const cardShadowBlur = cardShadowParsed.blur
  const cardShadowSpread = cardShadowParsed.spread
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
  const buttonShadowParsed = buttonShadowOn
    ? parseBoxShadow(buttonShadowStr)
    : { blur: 4, spread: 0 }
  const buttonShadowBlur = buttonShadowParsed.blur
  const buttonShadowSpread = buttonShadowParsed.spread
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
        <MethodTabs
          value={effectivePaletteMode}
          onChange={(_, value: 'light' | 'dark') => setPaletteMode(value)}
          aria-label="Palette mode"
          sx={{ marginBottom: 1 }}
        >
          <MethodTab
            value="light"
            disabled={!canLight}
            disableRipple
            label={<LightModeOutlinedIcon sx={{ fontSize: 24 }} />}
            aria-label="Light palette"
          />
          <MethodTab
            value="dark"
            disabled={!canDark}
            disableRipple
            label={<DarkModeOutlinedIcon sx={{ fontSize: 24 }} />}
            aria-label="Dark palette"
          />
        </MethodTabs>

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
              boxShadow: on
                ? buildBoxShadow(widgetShadowBlur, widgetShadowSpread)
                : 'none',
            })
          }
          shadowBlur={widgetShadowBlur}
          onShadowBlurChange={(blur) =>
            updateContainer({
              boxShadow: widgetShadowOn
                ? buildBoxShadow(blur, widgetShadowSpread)
                : 'none',
            })
          }
          shadowSpread={widgetShadowSpread}
          onShadowSpreadChange={(spread) =>
            updateContainer({
              boxShadow: widgetShadowOn
                ? buildBoxShadow(widgetShadowBlur, spread)
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
              boxShadow: on
                ? buildBoxShadow(cardShadowBlur, cardShadowSpread)
                : 'none',
            })
          }
          shadowBlur={cardShadowBlur}
          onShadowBlurChange={(blur) =>
            updateCardComponent({
              boxShadow: cardShadowOn
                ? buildBoxShadow(blur, cardShadowSpread)
                : 'none',
            })
          }
          shadowSpread={cardShadowSpread}
          onShadowSpreadChange={(spread) =>
            updateCardComponent({
              boxShadow: cardShadowOn
                ? buildBoxShadow(cardShadowBlur, spread)
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
              boxShadow: on
                ? buildBoxShadow(buttonShadowBlur, buttonShadowSpread)
                : 'none',
            })
          }
          shadowBlur={buttonShadowBlur}
          onShadowBlurChange={(blur) =>
            updateButtonComponent({
              boxShadow: buttonShadowOn
                ? buildBoxShadow(blur, buttonShadowSpread)
                : 'none',
            })
          }
          shadowSpread={buttonShadowSpread}
          onShadowSpreadChange={(spread) =>
            updateButtonComponent({
              boxShadow: buttonShadowOn
                ? buildBoxShadow(buttonShadowBlur, spread)
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
    <EditableColorRow
      label={<CapitalizeFirstLetter>{label}</CapitalizeFirstLetter>}
      hex={hex}
      ariaLabel={label}
      onChange={(newHex) => setColor(colorPath, newHex)}
    />
  )
}

interface EditableColorRowProps {
  label: React.ReactNode
  hex: string
  ariaLabel: string
  onChange: (hex: string) => void
}

const EditableColorRow = ({
  label,
  hex,
  ariaLabel,
  onChange,
}: EditableColorRowProps): JSX.Element => {
  const stripped = hex.replace(/^#/, '').toUpperCase()
  const [draft, setDraft] = useState(stripped)

  useEffect(() => {
    setDraft(hex.replace(/^#/, '').toUpperCase())
  }, [hex])

  const commit = useCallback(() => {
    const cleaned = draft.replace(/[^0-9a-fA-F]/g, '')
    if (cleaned.length === 6 || cleaned.length === 3) {
      const full = safe6DigitHexColor(`#${cleaned}`)
      onChange(full)
      setDraft(full.replace(/^#/, '').toUpperCase())
    } else {
      setDraft(stripped)
    }
  }, [draft, stripped, onChange])

  return (
    <Row>
      <RowLabel>{label}</RowLabel>
      <RowValue>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HexLabel>#</HexLabel>
          <ValueInput
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commit()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            inputProps={{
              'aria-label': ariaLabel,
              style: { width: 56 },
            }}
          />
        </Box>
        <ColorSwatch
          aria-label={`${ariaLabel} picker`}
          type="color"
          swatchColor={safe6DigitHexColor(`#${stripped}`)}
          value={safe6DigitHexColor(`#${stripped}`)}
          onChange={(e) => onChange(e.target.value)}
        />
      </RowValue>
    </Row>
  )
}

interface BorderWeightRowProps {
  title: string
  value: number
  onChange: (w: number) => void
}

const BorderWeightRow = ({
  title,
  value,
  onChange,
}: BorderWeightRowProps): JSX.Element => {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = useCallback(() => {
    const n = Number.parseInt(draft, 10)
    if (Number.isFinite(n) && n >= 1 && n <= 4) {
      onChange(n)
      setDraft(String(n))
    } else {
      setDraft(String(value))
    }
  }, [draft, value, onChange])

  return (
    <Row>
      <RowLabel>Weight</RowLabel>
      <RowValue>
        <ValueInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commit()
              ;(e.target as HTMLInputElement).blur()
            }
          }}
          inputProps={{
            'aria-label': `${title} border weight`,
            inputMode: 'numeric',
            style: { width: 16 },
          }}
        />
        <LineWeightOutlinedIcon sx={{ fontSize: 24, color: 'action.active' }} />
      </RowValue>
    </Row>
  )
}

interface EditableSliderValueProps {
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  ariaLabel: string
}

const EditableSliderValue = ({
  value,
  min,
  max,
  onChange,
  ariaLabel,
}: EditableSliderValueProps): JSX.Element => {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = useCallback(() => {
    const n = Number.parseInt(draft, 10)
    if (Number.isFinite(n)) {
      const clamped = Math.max(min, Math.min(max, n))
      onChange(clamped)
      setDraft(String(clamped))
    } else {
      setDraft(String(value))
    }
  }, [draft, value, min, max, onChange])

  return (
    <SliderValueInput
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          commit()
          ;(e.target as HTMLInputElement).blur()
        }
      }}
      inputProps={{
        'aria-label': ariaLabel,
        inputMode: 'numeric',
      }}
    />
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
  shadowSpread: number
  onShadowSpreadChange: (spread: number) => void
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
      <EditableColorRow
        label="Color"
        hex={surfaceColor}
        ariaLabel={`${title} color`}
        onChange={onSurfaceColorChange}
      />
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
      {shadowOn ? (
        <SubSection>
          <SubRow>
            <RowLabel>Blur</RowLabel>
            <ThemeSlider
              size="small"
              value={shadowBlur}
              min={0}
              max={48}
              onChange={(_, v) => onShadowBlurChange(v as number)}
              aria-label={`${title} shadow blur`}
            />
            <EditableSliderValue
              value={shadowBlur}
              min={0}
              max={48}
              onChange={onShadowBlurChange}
              ariaLabel={`${title} shadow blur`}
            />
          </SubRow>
          <SubRow>
            <RowLabel>Spread</RowLabel>
            <ThemeSlider
              size="small"
              value={shadowSpread}
              min={-20}
              max={20}
              onChange={(_, v) => onShadowSpreadChange(v as number)}
              aria-label={`${title} shadow spread`}
            />
            <EditableSliderValue
              value={shadowSpread}
              min={-20}
              max={20}
              onChange={onShadowSpreadChange}
              ariaLabel={`${title} shadow spread`}
            />
          </SubRow>
        </SubSection>
      ) : null}
      <ToggleRow>
        <ToggleRowLabel>Border</ToggleRowLabel>
        <Switch
          checked={borderOn}
          onChange={(_, c) => onBorderOnChange(c)}
          aria-label={`${title} border`}
        />
      </ToggleRow>
      {borderOn ? (
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
      ) : null}
    </Box>
  )
}
