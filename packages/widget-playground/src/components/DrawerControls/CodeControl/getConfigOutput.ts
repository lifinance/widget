import type { WidgetConfig, WidgetTheme } from '@lifi/widget';

// need to remove the
export const getConfigOutput = (
  config: Partial<WidgetConfig>,
): Partial<WidgetConfig> => {
  const { playground, ...theme } = config.theme as WidgetTheme;

  return {
    ...(config.variant ? { variant: config.variant } : {}),
    ...(config.subvariant ? { subvariant: config.subvariant } : {}),
    ...(config.appearance ? { appearance: config.appearance } : {}),
    ...(theme
      ? {
          theme,
        }
      : {}),
    ...(config.walletConfig ? { walletConfig: config.walletConfig } : {}),
  } as Partial<WidgetConfig>;
};
