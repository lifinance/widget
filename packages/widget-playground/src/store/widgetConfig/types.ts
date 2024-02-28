import type {
  Appearance,
  WidgetConfig,
  WidgetSubvariant,
  WidgetVariant,
  WidgetWalletConfig,
} from '@lifi/widget';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { StoreApi } from 'zustand';

export interface WidgetConfigValues {
  defaultConfig?: Partial<WidgetConfig>;
  config?: Partial<WidgetConfig>;
}

export interface WidgetConfigActions {
  setConfig: (config: Partial<WidgetConfig>) => void;
  setDefaultConfig: (defaultConfig: Partial<WidgetConfig>) => void;
  resetConfig: () => void;
  setAppearance: (appearance: Appearance) => void;
  setVariant: (variant: WidgetVariant) => void;
  setSubvariant: (subvariant: WidgetSubvariant) => void;
  setBorderRadius: (radius: number) => void;
  resetBorderRadius: () => void;
  setBorderRadiusSecondary: (radius: number) => void;
  resetBorderRadiusSecondary: () => void;
  setColor: (path: string, color: string) => void;
  setFontFamily: (fontName: string) => void;
  setWalletConfig: (walletConfig?: WidgetWalletConfig) => void;
}

export type WidgetConfigState = WidgetConfigValues & WidgetConfigActions;

export type WidgetConfigStore = UseBoundStoreWithEqualityFn<
  StoreApi<WidgetConfigState>
>;
