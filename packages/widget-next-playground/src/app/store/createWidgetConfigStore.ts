import { createWithEqualityFn } from 'zustand/traditional';
import { WidgetConfig } from '@lifi/widget';
import { WidgetConfigState } from './types';

export const createWidgetConfigStore = (initialConfig: Partial<WidgetConfig>) =>
  createWithEqualityFn<WidgetConfigState>((set) => ({
    config: initialConfig,
    setConfig: (config) => {
      set({
        config,
      });
    },
  }));
