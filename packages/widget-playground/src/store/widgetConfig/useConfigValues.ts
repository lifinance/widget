import type {
  SubvariantOptions,
  WidgetSubvariant,
  WidgetVariant,
  WidgetWalletConfig,
} from '@lifi/widget'
import { palette, paletteDark, paletteLight } from '@lifi/widget'
import { getValueFromPath } from '../../utils/getValueFromPath.js'
import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const usePlaygroundWidgetMode = () => {
  const playgroundWidgetMode = useWidgetConfigStore(
    (store) => store.playgroundWidgetMode
  )

  return {
    playgroundWidgetMode,
  }
}

export const useConfigVariant = (): { variant: WidgetVariant | 'default' } => {
  const variant = useWidgetConfigStore((store) => store.config?.variant)

  return {
    variant: !variant ? 'default' : variant,
  }
}

export const useConfigSubvariant = (): {
  subvariant: WidgetSubvariant | 'default'
} => {
  const subvariant = useWidgetConfigStore((store) => store.config?.subvariant)

  return {
    subvariant: !subvariant ? 'default' : subvariant,
  }
}

export const useConfigSubvariantOptions = (): {
  subvariantOptions: SubvariantOptions | undefined
} => {
  const subvariantOptions = useWidgetConfigStore(
    (store) => store.config?.subvariantOptions
  )

  return {
    subvariantOptions: subvariantOptions,
  }
}

export const useConfigBorderRadius = (): {
  borderRadius: number | undefined
} => {
  const borderRadius = useWidgetConfigStore(
    (store) => store.config?.theme?.shape?.borderRadius
  )

  return {
    borderRadius: borderRadius,
  }
}

export const useConfigBorderRadiusSecondary = (): {
  borderRadiusSecondary: number | undefined
} => {
  const borderRadiusSecondary = useWidgetConfigStore(
    (store) => store.config?.theme?.shape?.borderRadiusSecondary
  )

  return {
    borderRadiusSecondary: borderRadiusSecondary,
  }
}

const defaultThemePalette = {
  theme: {
    colorSchemes: {
      light: {
        palette: { ...palette, ...paletteLight },
      },
      dark: {
        palette: { ...palette, ...paletteDark },
      },
    },
  },
}

export const useConfigColorsFromPath = (
  ...paths: string[]
): (string | undefined)[] => {
  const colors = useWidgetConfigStore((store) =>
    paths.map((path) => getValueFromPath<string>(store.config, path))
  ) as Array<string | undefined>

  return colors.map((color, i) => {
    if (!color) {
      return getValueFromPath<string>(defaultThemePalette, paths[i])
    }
    return color
  })
}

export const useConfigFontFamily = (): {
  fontFamily: string | undefined
} => {
  const fontFamily = useWidgetConfigStore(
    (store) => store.config?.theme?.typography?.fontFamily
  )

  return {
    fontFamily: fontFamily,
  }
}

export const useConfigWalletManagement = (): {
  replacementWalletConfig: WidgetWalletConfig | { onConnect: () => void }
  isExternalWalletManagement: boolean
  isPartialWalletManagement: boolean
  isForceInternalWalletManagement: boolean
} => {
  const [walletConfig, defaultWalletConfig] = useWidgetConfigStore((store) => [
    store.config?.walletConfig,
    store.defaultConfig?.walletConfig,
  ])

  const replacementWalletConfig = defaultWalletConfig
    ? defaultWalletConfig
    : { onConnect: () => {} }

  return {
    replacementWalletConfig: replacementWalletConfig,
    isExternalWalletManagement: !!walletConfig,
    isPartialWalletManagement: !!walletConfig?.usePartialWalletManagement,
    isForceInternalWalletManagement:
      !!walletConfig?.forceInternalWalletManagement,
  }
}
