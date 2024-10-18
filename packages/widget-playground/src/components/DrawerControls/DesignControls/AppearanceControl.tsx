import type { Appearance, WidgetTheme } from '@lifi/widget'
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto'
import LightModeIcon from '@mui/icons-material/LightMode'
import NightlightIcon from '@mui/icons-material/Nightlight'
import type { TabProps } from '@mui/material'
import { Box, Tooltip } from '@mui/material'
import diff from 'microdiff'
import type { FC, PropsWithChildren, ReactElement, SyntheticEvent } from 'react'
import { useEffect } from 'react'
import { type ThemeMode, useThemeMode } from '../../../hooks/useThemeMode'
import type { ThemeItem } from '../../../store/editTools/types'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useConfigAppearance } from '../../../store/widgetConfig/useConfigAppearance'
import { useThemeValues } from '../../../store/widgetConfig/useThemeValues'
import { cloneStructuredConfig } from '../../../utils/cloneStructuredConfig'
import { patch } from '../../../utils/patch'
import { CardValue } from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import { Tab, Tabs } from '../../Tabs/Tabs.style'
import { Badge, CapitalizeFirstLetter } from './DesignControls.style'

const appearanceIcons = {
  light: LightModeIcon,
  dark: NightlightIcon,
  auto: BrightnessAutoIcon,
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
    <Tab icon={Icon} value={value} disabled={disabled} {...props} />
  ) : (
    <Tooltip title={title} arrow>
      <Tab icon={Icon} value={value} {...props} />
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
  appearance: Appearance,
  themeMode: ThemeMode,
  getCurrentConfigTheme: () => WidgetTheme | undefined
) => {
  if (selectedThemeItem) {
    const normalisedAppearance = appearance === 'auto' ? themeMode : appearance
    const themePreset = selectedThemeItem.theme[normalisedAppearance]
    const currentTheme = getCurrentConfigTheme()

    if (themePreset && currentTheme) {
      return diff(themePreset, currentTheme)
    }
  }
}

export const AppearanceControl = () => {
  const { appearance } = useConfigAppearance()
  const themeMode = useThemeMode()
  const { setAppearance, setConfigTheme, getCurrentConfigTheme } =
    useConfigActions()
  const { setViewportBackgroundColor } = useEditToolsActions()
  const { selectedThemeItem } = useThemeValues()

  const restricted = !!(
    selectedThemeItem && Object.keys(selectedThemeItem.theme).length < 2
  )

  useEffect(() => {
    if (restricted) {
      const restrictedAppearance = Object.keys(
        selectedThemeItem.theme
      )[0] as Appearance
      setAppearance(restrictedAppearance)
    }
  }, [selectedThemeItem, setAppearance, restricted])

  const handleAppearanceChange = (_: SyntheticEvent, value: Appearance) => {
    if (selectedThemeItem) {
      const userChangesToTheme = getUserChangesToTheme(
        selectedThemeItem,
        appearance,
        themeMode,
        getCurrentConfigTheme
      )

      const newAppearance = value === 'auto' ? themeMode : value

      const newTheme = userChangesToTheme
        ? (patch(
            cloneStructuredConfig<WidgetTheme>(
              selectedThemeItem.theme[newAppearance]
            ),
            userChangesToTheme
          ) as WidgetTheme)
        : selectedThemeItem.theme[newAppearance]

      setConfigTheme(newTheme, selectedThemeItem.id)

      const viewportBackground =
        selectedThemeItem.theme[newAppearance].playground?.background
      setViewportBackgroundColor(viewportBackground as string | undefined)
    }

    setAppearance(value)
  }

  return (
    <ExpandableCard
      title={'Mode'}
      value={
        <BadgableCardValue showBadge={restricted}>
          {appearance}
        </BadgableCardValue>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {restricted ? (
          <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
            {appearance} mode is recommended for this theme
          </CapitalizeFirstLetter>
        ) : null}

        <Tabs
          value={appearance}
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
