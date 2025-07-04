import { palette, paletteDark, paletteLight } from '@lifi/widget'
import { shallow } from 'zustand/shallow'
import { getValueFromPath } from '../../utils/getValueFromPath'
import type { FormValues } from '../types'
import { useWidgetConfigStore } from './WidgetConfigProvider'

export const useConfigVariant = () => {
  const [variant] = useWidgetConfigStore(
    (store) => [store.config?.variant],
    shallow
  )

  return {
    variant: !variant ? 'default' : variant,
  }
}

export const useConfigFormValues = () => {
  const [fromChain, fromToken, fromAmount, toChain, toToken, toAddress] =
    useWidgetConfigStore(
      (store) => [
        store.config?.fromChain,
        store.config?.fromToken,
        store.config?.fromAmount,
        store.config?.toChain,
        store.config?.toToken,
        store.config?.toAddress,
      ],
      shallow
    )

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
  const [subvariant] = useWidgetConfigStore(
    (store) => [store.config?.subvariant],
    shallow
  )

  return {
    subvariant: !subvariant ? 'default' : subvariant,
  }
}

export const useConfigSubvariantOptions = () => {
  const [subvariantOptions] = useWidgetConfigStore(
    (store) => [store.config?.subvariantOptions],
    shallow
  )

  return {
    subvariantOptions,
  }
}

export const useConfigBorderRadius = () => {
  const [borderRadius] = useWidgetConfigStore(
    (store) => [store.config?.theme?.shape?.borderRadius],
    shallow
  )

  return {
    borderRadius,
  }
}

export const useConfigBorderRadiusSecondary = () => {
  const [borderRadiusSecondary] = useWidgetConfigStore(
    (store) => [store.config?.theme?.shape?.borderRadiusSecondary],
    shallow
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
  const colors = useWidgetConfigStore(
    (store) =>
      paths.map((path) => getValueFromPath<string>(store.config, path)),
    shallow
  ) as Array<string | undefined>

  return colors.map((color, i) => {
    if (!color) {
      return getValueFromPath<string>(defaultThemePalette, paths[i])
    }
    return color
  })
}

export const useConfigFontFamily = () => {
  const [fontFamily] = useWidgetConfigStore(
    (store) => [store.config?.theme?.typography?.fontFamily],
    shallow
  )

  return {
    fontFamily,
  }
}

export const useConfigWalletManagement = () => {
  const [walletConfig, defaultWalletConfig] = useWidgetConfigStore(
    (store) => [store.config?.walletConfig, store.defaultConfig?.walletConfig],
    shallow
  )

  const replacementWalletConfig = defaultWalletConfig
    ? defaultWalletConfig
    : { onConnect: () => {} }

  return {
    isExternalWalletManagement: !!walletConfig,
    isPartialWalletManagement: !!walletConfig?.usePartialWalletManagement,
    replacementWalletConfig,
  }
}
