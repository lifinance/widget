import {
  useConfigSubvariant,
  useConfigSubvariantOptions,
  useConfigVariant,
  useConfigWalletManagement,
} from '../store/widgetConfig/useConfigValues.js'
import { useThemeValues } from '../store/widgetConfig/useThemeValues.js'
import { getLayoutLabel } from '../utils/layout.js'
import { getModeLabel, getWalletLabel } from '../utils/sidebar.js'
import { formatThemeDisplayName } from '../utils/themeEdit.js'
import { usePlaygroundLayoutControls } from './usePlaygroundLayoutControls.js'
import { useThemeMode } from './useThemeMode.js'

export const useSidebarNavLabels = (): {
  themeLabel: string | undefined
  modeValue: string
  variantValue: string
  heightValue: string
  walletValue: string
} => {
  const { themeMode } = useThemeMode()
  const { subvariant } = useConfigSubvariant()
  const { subvariantOptions } = useConfigSubvariantOptions()
  const { variant } = useConfigVariant()
  const { selectedLayoutId } = usePlaygroundLayoutControls()
  const { isExternalWalletManagement, isPartialWalletManagement } =
    useConfigWalletManagement()
  const { selectedThemeItem } = useThemeValues()

  const isDrawerVariant = variant === 'drawer'

  return {
    themeLabel: selectedThemeItem
      ? formatThemeDisplayName(selectedThemeItem, themeMode)
      : undefined,
    modeValue: getModeLabel(
      subvariant,
      subvariantOptions?.split as string | undefined
    ),
    variantValue:
      variant === 'compact'
        ? 'Compact'
        : variant === 'wide'
          ? 'Wide'
          : 'Drawer',
    heightValue: getLayoutLabel(selectedLayoutId, isDrawerVariant),
    walletValue: getWalletLabel(
      isExternalWalletManagement,
      isPartialWalletManagement
    ),
  }
}
