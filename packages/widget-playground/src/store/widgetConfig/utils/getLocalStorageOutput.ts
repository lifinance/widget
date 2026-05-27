import type { WidgetConfig } from '@lifi/widget'

export const getLocalStorageOutput = (
  config: Partial<WidgetConfig>
): Partial<WidgetConfig> => {
  return {
    ...(config.variant ? { variant: config.variant } : {}),
    ...(config.mode ? { mode: config.mode } : {}),
    ...(config.modeOptions ? { modeOptions: config.modeOptions } : {}),
    ...(config.appearance ? { appearance: config.appearance } : {}),
    ...(config.theme
      ? {
          theme: {
            ...(config.theme.shape
              ? {
                  shape: {
                    ...(config.theme.shape.borderRadius
                      ? { borderRadius: config.theme.shape.borderRadius }
                      : {}),
                    ...(config.theme.shape.borderRadiusSecondary
                      ? {
                          borderRadiusSecondary:
                            config.theme.shape.borderRadiusSecondary,
                        }
                      : {}),
                  },
                }
              : {}),
            ...(config.theme.typography
              ? {
                  typography: {
                    ...(config.theme.typography.fontFamily
                      ? { fontFamily: config.theme.typography.fontFamily }
                      : {}),
                  },
                }
              : {}),
            ...(config.theme.colorSchemes
              ? {
                  colorSchemes: {
                    ...config.theme.colorSchemes,
                  },
                }
              : {}),
            ...(config.theme.container
              ? { container: config.theme.container }
              : {}),
          },
        }
      : {}),
    ...(config.walletConfig ? { walletConfig: config.walletConfig } : {}),
  } as Partial<WidgetConfig>
}
