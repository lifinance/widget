import type {
  HiddenUIConfig,
  ModeOptions,
  WidgetMode,
  WidgetVariant,
  WidgetWalletConfig,
} from '@lifi/widget'
import { palette, paletteDark, paletteLight } from '@lifi/widget'
import type { CSSProperties } from 'react'
import { useShallow } from 'zustand/shallow'
import { getValueFromPath } from '../../utils/getValueFromPath.js'
import type { PlaygroundWidgetMode } from './types.js'
import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const usePlaygroundWidgetMode = (): {
  playgroundWidgetMode: PlaygroundWidgetMode
} => {
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

export const useConfigMode = (): {
  mode: WidgetMode | 'default'
} => {
  const mode = useWidgetConfigStore((store) => store.config?.mode)

  return {
    mode: !mode ? 'default' : mode,
  }
}

export const useConfigModeOptions = (): {
  modeOptions: ModeOptions | undefined
} => {
  const modeOptions = useWidgetConfigStore((store) => store.config?.modeOptions)

  return {
    modeOptions: modeOptions,
  }
}

export const useConfigHiddenUI = (): {
  hiddenUI: HiddenUIConfig | undefined
} => {
  const hiddenUI = useWidgetConfigStore((store) => store.config?.hiddenUI)

  return {
    hiddenUI: hiddenUI,
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

export const useConfigColor = (path: string): string | undefined => {
  const color = useWidgetConfigStore((store) =>
    getValueFromPath<string>(store.config, path)
  )

  if (!color) {
    return getValueFromPath<string>(defaultThemePalette, path)
  }
  return color
}

export const useConfigContainer = (): {
  container: CSSProperties | undefined
} => {
  const container = useWidgetConfigStore(
    (store) => store.config?.theme?.container
  )

  return { container }
}

export const useConfigHeaderPosition = (): {
  headerPosition: string | undefined
} => {
  const headerPosition = useWidgetConfigStore(
    (store) => store.config?.theme?.header?.position
  )

  return { headerPosition }
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

const defaultWalletConfigFallback = { onConnect: () => {} }

export const useConfigWalletManagement = (): {
  replacementWalletConfig: WidgetWalletConfig | { onConnect: () => void }
  isExternalWalletManagement: boolean
  isPartialWalletManagement: boolean
  isForceInternalWalletManagement: boolean
} => {
  const [walletConfig, defaultWalletConfig] = useWidgetConfigStore(
    useShallow((store) => [
      store.config?.walletConfig,
      store.defaultConfig?.walletConfig,
    ])
  )

  const replacementWalletConfig =
    defaultWalletConfig || defaultWalletConfigFallback

  return {
    replacementWalletConfig: replacementWalletConfig,
    isExternalWalletManagement: !!walletConfig,
    isPartialWalletManagement: !!walletConfig?.usePartialWalletManagement,
    isForceInternalWalletManagement:
      !!walletConfig?.forceInternalWalletManagement,
  }
}
