import { expect, test, describe } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks';
import type { WidgetConfig } from '@lifi/widget';
import type { WidgetConfigProviderProps } from './WidgetConfigProvider';
import {
  useWidgetConfigStore,
  WidgetConfigProvider,
} from './WidgetConfigProvider';

const wrapper = ({
  defaultWidgetConfig,
  children,
}: WidgetConfigProviderProps) => (
  <WidgetConfigProvider defaultWidgetConfig={defaultWidgetConfig}>
    {children}
  </WidgetConfigProvider>
);

interface RenderWidgetConfigProviderProps {
  initialWidgetConfig: Partial<WidgetConfig>;
}

const renderWidgetConfigProvider = ({
  initialWidgetConfig,
}: RenderWidgetConfigProviderProps) => {
  return renderHook(
    () => useWidgetConfigStore((state) => [state.config, state.resetConfig]),
    {
      wrapper,
      initialProps: {
        defaultWidgetConfig: {
          appearance: 'auto',
        } as Partial<WidgetConfig>,
      },
    },
  );
};

describe('WidgetConfigProvider', () => {
  test('config is initialised', () => {
    const { result } = renderWidgetConfigProvider({
      initialWidgetConfig: {
        appearance: 'auto',
      } as Partial<WidgetConfig>,
    });

    const [config] = result.current;

    expect(config).toEqual({
      appearance: 'auto',
    });
  });

  test('allow config properties that are not whitelisted to be updated via the defaultWidgetConfig', () => {
    const { result, rerender } = renderWidgetConfigProvider({
      initialWidgetConfig: {
        appearance: 'auto',
      } as Partial<WidgetConfig>,
    });

    let config = result.current[0];
    expect(config).toEqual({
      appearance: 'auto',
    });

    rerender({
      defaultWidgetConfig: {
        appearance: 'auto',
        bridges: {
          allow: ['stargate'],
          deny: ['connext'],
        },
      } as Partial<WidgetConfig>,
    });

    config = result.current[0];
    expect(config).toEqual({
      appearance: 'auto',
      bridges: {
        allow: ['stargate'],
        deny: ['connext'],
      },
    });
  });

  test('only allow whitelisted config properties can only be updated via the defaultWidgetConfig when the config is reset', () => {
    const { result, rerender } = renderWidgetConfigProvider({
      initialWidgetConfig: {
        appearance: 'auto',
      } as Partial<WidgetConfig>,
    });

    let config = result.current[0];
    expect(config).toEqual({
      appearance: 'auto',
    });

    rerender({
      defaultWidgetConfig: {
        appearance: 'dark',
      } as Partial<WidgetConfig>,
    });

    config = result.current[0];
    expect(config).toEqual({
      appearance: 'auto',
    });

    const resetConfig = result.current[1] as () => void;
    act(() => {
      resetConfig();
    });

    config = result.current[0];
    expect(config).toEqual({
      appearance: 'dark',
    });
  });
});
