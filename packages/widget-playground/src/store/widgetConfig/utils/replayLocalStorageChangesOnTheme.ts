import type { WidgetConfig, WidgetTheme } from '@lifi/widget/dist/_esm';
import diff from 'microdiff';
import { patch } from '../../../utils';
import { cloneStructuredConfig } from './cloneStructuredConfig';
import { getLocalStorageOutput } from './getLocalStorageOutput';

export const replayLocalStorageChangesOnTheme = (
  theme: WidgetTheme,
  localStoredConfig: Partial<WidgetConfig>,
) => {
  const tempConfig: Partial<WidgetConfig> = { theme };

  const differences = diff(
    getLocalStorageOutput(tempConfig),
    getLocalStorageOutput(localStoredConfig),
  );

  const updatedConfig = patch(
    cloneStructuredConfig<Partial<WidgetConfig>>(tempConfig),
    differences,
  ) as Partial<WidgetConfig>;

  return updatedConfig.theme!;
};
