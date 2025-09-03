import type { Appearance, WidgetTheme } from '@lifi/widget'
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto'
import LightModeIcon from '@mui/icons-material/LightMode'
import NightlightIcon from '@mui/icons-material/Nightlight'
import type { TabProps } from '@mui/material'
import { Box, Tooltip } from '@mui/material'
import diff from 'microdiff'
import type { FC, PropsWithChildren, ReactElement, SyntheticEvent } from 'react'
import { useEffect } from 'react'
import { useThemeMode } from '../../../hooks/useThemeMode.js'
import type { ThemeItem } from '../../../store/editTools/types.js'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions.js'
import { useThemeValues } from '../../../store/widgetConfig/useThemeValues.js'
import { cloneStructuredConfig } from '../../../utils/cloneStructuredConfig.js'
import { patch } from '../../../utils/patch.js'
import { CardValue } from '../../Card/Card.style.js'
import { ExpandableCard } from '../../Card/ExpandableCard.js'
import { Tab, Tabs } from '../../Tabs/Tabs.style.js'
import { Badge, CapitalizeFirstLetter } from './DesignControls.style.js'

const appearanceIcons = {
  light: LightModeIcon,
  dark: NightlightIcon,
  system: BrightnessAutoIcon,
}

interface AppearanceTabProps extends TabProps {
  title: string
  value: Appearance
  Icon: ReactElement
}

const AppearanceTab: FC<AppearanceTabProps> = ({
  title,
  value,
  Icon,
  disabled,
  ...props
}) =>
  disabled ? (
    <Tab
      icon={Icon}
      value={value}
      disabled={disabled}
      disableRipple
      {...props}
    />
  ) : (
    <Tooltip title={title} arrow>
      <Tab icon={Icon} value={value} disableRipple {...props} />
    </Tooltip>
  )

interface BadgableCardValueProps extends PropsWithChildren {
  showBadge: boolean
}

const BadgableCardValue = ({ children, showBadge }: BadgableCardValueProps) => {
  return showBadge ? (
    <Badge variant="dot" color="primary">
      <CardValue sx={{ textTransform: 'capitalize' }}>{children}</CardValue>
    </Badge>
  ) : (
    <CardValue sx={{ textTransform: 'capitalize' }}>{children}</CardValue>
  )
}

const getUserChangesToTheme = (
  selectedThemeItem: ThemeItem,
  getCurrentConfigTheme: () => WidgetTheme | undefined
) => {
  if (selectedThemeItem) {
    const themePreset = selectedThemeItem.theme
    const currentTheme = getCurrentConfigTheme()

    if (themePreset && currentTheme) {
      return diff(themePreset, currentTheme)
    }
  }
}

export const AppearanceControl = () => {
  const { colorSchemeMode, prefersDarkMode, setMode } = useThemeMode()
  const { setAppearance, setConfigTheme, getCurrentConfigTheme } =
    useConfigActions()
  const { setViewportBackgroundColor } = useEditToolsActions()
  const { selectedThemeItem } = useThemeValues()

  const restricted = selectedThemeItem
    ? Object.keys(selectedThemeItem.theme.colorSchemes ?? {}).length < 2
    : false

  const handleAppearanceChange = (_: SyntheticEvent, value: Appearance) => {
    if (selectedThemeItem) {
      const userChangesToTheme = getUserChangesToTheme(
        selectedThemeItem,
        getCurrentConfigTheme
      )

      const newTheme = userChangesToTheme?.length
        ? (patch(
            cloneStructuredConfig<WidgetTheme>(selectedThemeItem.theme),
            userChangesToTheme
          ) as WidgetTheme)
        : selectedThemeItem.theme

      setConfigTheme(newTheme, selectedThemeItem.id)
    }

    setAppearance(value)
    setMode(value)
  }

  useEffect(() => {
    if (restricted) {
      const restrictedAppearance = Object.keys(
        selectedThemeItem?.theme.colorSchemes ?? {}
      )[0] as Appearance
      setAppearance(restrictedAppearance)
      setMode(restrictedAppearance)
    }
  }, [selectedThemeItem, setAppearance, restricted, setMode])

  useEffect(() => {
    const newAppearance =
      colorSchemeMode === 'system'
        ? prefersDarkMode
          ? 'dark'
          : 'light'
        : colorSchemeMode
    const viewportBackground =
      selectedThemeItem?.theme.colorSchemes?.[newAppearance]?.palette
        ?.playground?.main
    setViewportBackgroundColor(viewportBackground as string | undefined)
  }, [
    colorSchemeMode,
    setViewportBackgroundColor,
    selectedThemeItem,
    prefersDarkMode,
  ])

  return (
    <ExpandableCard
      title={'Appearance'}
      value={
        <BadgableCardValue showBadge={restricted}>
          {colorSchemeMode}
        </BadgableCardValue>
      }
      dataTestId="appearance-section"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {restricted ? (
          <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
            {colorSchemeMode} mode is recommended for this theme
          </CapitalizeFirstLetter>
        ) : null}

        <Tabs
          value={colorSchemeMode}
          aria-label="tabs"
          indicatorColor="primary"
          onChange={handleAppearanceChange}
        >
          {Object.entries(appearanceIcons).map(([appearance, Icon]) => {
            const supportedAppearance = appearance as Appearance

            return (
              <AppearanceTab
                key={supportedAppearance}
                title={supportedAppearance}
                value={supportedAppearance}
                Icon={<Icon />}
                disabled={restricted}
              />
            )
          })}
        </Tabs>
      </Box>
    </ExpandableCard>
  )
}
