import type { WidgetConfig, WidgetTheme } from '@lifi/widget'
import { defaultMaxHeight } from '@lifi/widget'

export const getConfigOutput = (
  config: Partial<WidgetConfig>
): Partial<WidgetConfig> => {
  const { playground, ...theme } = config.theme as WidgetTheme

  return {
    ...(config.variant ? { variant: config.variant } : {}),
    ...(config.subvariant ? { subvariant: config.subvariant } : {}),
    ...(config.appearance ? { appearance: config.appearance } : {}),
    ...(theme
      ? {
          theme: {
            ...theme,
            ...(theme.container
              ? {
                  container: {
                    ...theme.container,
                    ...(theme.container.maxHeight &&
                    theme.container.maxHeight !== defaultMaxHeight
                      ? { maxHeight: theme.container.maxHeight }
                      : { maxHeight: undefined }),
                  },
                }
              : {}),
          },
        }
      : {}),
    ...(config.walletConfig ? { walletConfig: config.walletConfig } : {}),
  } as Partial<WidgetConfig>
}
