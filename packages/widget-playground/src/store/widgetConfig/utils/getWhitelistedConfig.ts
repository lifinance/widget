import type { SimplePaletteColorOptions } from '@mui/material';
import type { WidgetConfig } from '@lifi/widget';

/**
 * This utility is useful when looking to merge local development config with
 * local config overrides that have been made locally using the playground edit tools.
 * The tools in the playground currently only allow editing of a small subset of the
 * widget config so when merging changes of the local config we only need to be concerned about
 * that small subset.
 *
 * @param config The config object that to create the editor subset from
 */
export const getWhitelistedConfig = (
  config: Partial<WidgetConfig>,
): Partial<WidgetConfig> => {
  return {
    ...(config.variant ? { variant: config.variant } : {}),
    ...(config.subvariant ? { subvariant: config.subvariant } : {}),
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
            ...(config.theme.palette
              ? {
                  palette: {
                    ...(config.theme.palette.primary
                      ? {
                          primary: {
                            ...((
                              config.theme.palette
                                .primary as SimplePaletteColorOptions
                            ).main
                              ? {
                                  main: (
                                    config.theme.palette
                                      .primary as SimplePaletteColorOptions
                                  ).main,
                                }
                              : {}),
                          },
                        }
                      : {}),
                    ...(config.theme.palette.secondary
                      ? {
                          secondary: {
                            ...((
                              config.theme.palette
                                .secondary as SimplePaletteColorOptions
                            ).main
                              ? {
                                  main: (
                                    config.theme.palette
                                      .secondary as SimplePaletteColorOptions
                                  ).main,
                                }
                              : {}),
                          },
                        }
                      : {}),
                  },
                }
              : {}),
          },
        }
      : {}),
    ...(config.walletConfig ? { walletConfig: config.walletConfig } : {}),
  } as Partial<WidgetConfig>;
};
