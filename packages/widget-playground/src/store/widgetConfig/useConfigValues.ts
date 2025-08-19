import { palette, paletteDark, paletteLight } from '@lifi/widget'
import { getValueFromPath } from '../../utils/getValueFromPath.js'
import type { FormValues } from '../types.js'
import { useWidgetConfigStore } from './WidgetConfigProvider.js'

export const useConfigVariant = () => {
  const variant = useWidgetConfigStore((store) => store.config?.variant)

  return {
    variant: !variant ? 'default' : variant,
  }
}

export const useConfigFormValues = () => {
  const [fromChain, fromToken, fromAmount, toChain, toToken, toAddress] =
    useWidgetConfigStore((store) => [
      store.config?.fromChain,
      store.config?.fromToken,
      store.config?.fromAmount,
      store.config?.toChain,
      store.config?.toToken,
      store.config?.toAddress,
    ])

  return {
    fromChain,
    fromToken,
    toChain,
    toToken,
    fromAmount,
    toAddress,
  } as FormValues
}

export const useConfigSubvariant = () => {
  const subvariant = useWidgetConfigStore((store) => store.config?.subvariant)

  return {
    subvariant: !subvariant ? 'default' : subvariant,
  }
}

export const useConfigSubvariantOptions = () => {
  const subvariantOptions = useWidgetConfigStore(
    (store) => store.config?.subvariantOptions
  )

  return {
    subvariantOptions,
  }
}

export const useConfigBorderRadius = () => {
  const borderRadius = useWidgetConfigStore(
    (store) => store.config?.theme?.shape?.borderRadius
  )

  return {
    borderRadius,
  }
}

export const useConfigBorderRadiusSecondary = () => {
  const borderRadiusSecondary = useWidgetConfigStore(
    (store) => store.config?.theme?.shape?.borderRadiusSecondary
  )

  return {
    borderRadiusSecondary,
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

export const useConfigColorsFromPath = (...paths: string[]) => {
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

export const useConfigFontFamily = () => {
  const fontFamily = useWidgetConfigStore(
    (store) => store.config?.theme?.typography?.fontFamily
  )

  return {
    fontFamily,
  }
}

export const useConfigWalletManagement = () => {
  const [walletConfig, defaultWalletConfig] = useWidgetConfigStore((store) => [
    store.config?.walletConfig,
    store.defaultConfig?.walletConfig,
  ])

  const replacementWalletConfig = defaultWalletConfig
    ? defaultWalletConfig
    : { onConnect: () => {} }

  return {
    replacementWalletConfig,
    isExternalWalletManagement: !!walletConfig,
    isPartialWalletManagement: !!walletConfig?.usePartialWalletManagement,
    isForceInternalWalletMangement:
      !!walletConfig?.forceInternalWalletManagement,
  }
}
