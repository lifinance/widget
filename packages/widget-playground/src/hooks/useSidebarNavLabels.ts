import {
  useConfigContainer,
  useConfigMode,
  useConfigModeOptions,
  useConfigVariant,
  useConfigWalletManagement,
  usePlaygroundWidgetMode,
} from '../store/widgetConfig/useConfigValues.js'
import { useThemeValues } from '../store/widgetConfig/useThemeValues.js'
import { getLayoutLabel, getLayoutMode } from '../utils/layout.js'
import { getModeLabel, getWalletLabel } from '../utils/sidebar.js'
import { formatThemeDisplayName } from '../utils/themeEdit.js'
import { useThemeMode } from './useThemeMode.js'

export const useSidebarNavLabels = (): {
  themeLabel: string | undefined
  modeValue: string
  variantValue: string
  heightValue: string
  walletValue: string
} => {
  const { themeMode } = useThemeMode()
  const { playgroundWidgetMode } = usePlaygroundWidgetMode()
  const { mode } = useConfigMode()
  const { modeOptions } = useConfigModeOptions()
  const { variant } = useConfigVariant()
  const { container } = useConfigContainer()
  const { isExternalWalletManagement, isPartialWalletManagement } =
    useConfigWalletManagement()
  const { selectedThemeItem } = useThemeValues()

  const isDrawerVariant = variant === 'drawer'

  return {
    themeLabel: selectedThemeItem
      ? formatThemeDisplayName(selectedThemeItem, themeMode)
      : undefined,
    modeValue:
      playgroundWidgetMode === 'checkout'
        ? 'Checkout'
        : getModeLabel(mode, modeOptions?.split as string | undefined),
    variantValue:
      variant === 'compact'
        ? 'Compact'
        : variant === 'wide'
          ? 'Wide'
          : 'Drawer',
    heightValue: getLayoutLabel(getLayoutMode(container), isDrawerVariant),
    walletValue: getWalletLabel(
      isExternalWalletManagement,
      isPartialWalletManagement
    ),
  }
}
