import { expect, test, describe } from 'vitest';
import { getWhitelistedConfig } from './getWhitelistedConfig';
import type { WidgetConfig } from '@lifi/widget';

describe('getWhitelistConfig', () => {
  test('presents copy of the config with a variant property if present', () => {
    const config = {
      variant: 'expandable',
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({
      variant: 'expandable',
    });
  });

  test('presents copy of the config with a subvariant property if present', () => {
    const config = {
      subvariant: 'split',
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({
      subvariant: 'split',
    });
  });

  test('presents copy of the config with a appearance property if present', () => {
    const config = {
      appearance: 'auto',
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({
      appearance: 'auto',
    });
  });

  test('presents copy of the config with a primary main color property if present', () => {
    const config = {
      theme: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
        },
      },
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({
      theme: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
        },
      },
    });
  });

  test('presents copy of the config with a secondary main color property if present', () => {
    const config = {
      theme: {
        palette: {
          secondary: {
            main: '#F5B5FF',
          },
        },
      },
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({
      theme: {
        palette: {
          secondary: {
            main: '#F5B5FF',
          },
        },
      },
    });
  });

  test('presents copy of the config with a typography fontFamily property if present', () => {
    const config = {
      theme: {
        typography: {
          fontFamily: 'Inter, sans-serif',
        },
      },
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({
      theme: {
        typography: {
          fontFamily: 'Inter, sans-serif',
        },
      },
    });
  });

  test('presents copy of the config with a shape borderRadius property if present', () => {
    const config = {
      theme: {
        shape: {
          borderRadius: 8,
        },
      },
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({
      theme: {
        shape: {
          borderRadius: 8,
        },
      },
    });
  });

  test('presents copy of the config with a shape borderRadiusSecondary property if present', () => {
    const config = {
      theme: {
        shape: {
          borderRadiusSecondary: 12,
        },
      },
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({
      theme: {
        shape: {
          borderRadiusSecondary: 12,
        },
      },
    });
  });

  test('presents copy of the config with a walletConfig property if present', () => {
    const config = {
      walletConfig: {},
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({
      walletConfig: {},
    });
  });

  test('presents an object removing config items not supported by the playground editor', () => {
    const config = {
      bridges: {
        allow: ['stargate'],
        deny: ['connext'],
      },
    } as Partial<WidgetConfig>;

    const whitelistedConfig = getWhitelistedConfig(config);

    expect(whitelistedConfig).toEqual({});
  });
});
