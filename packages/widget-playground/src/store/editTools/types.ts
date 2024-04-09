import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { StoreApi } from 'zustand';
import type { Font } from '../../providers';
import type { WidgetTheme } from '@lifi/widget';

type ControlType = 'design' | 'code';
type CodeControlTab = 'config' | 'examples';

export type ThemeAppearances =
  | {
      light: WidgetTheme;
    }
  | {
      dark: WidgetTheme;
    }
  | {
      light: WidgetTheme;
      dark: WidgetTheme;
    };

interface ThemeAppearancesIndexable {
  [key: string]: WidgetTheme;
}

export interface ThemeItem {
  id: string;
  name: string;
  theme: ThemeAppearances & ThemeAppearancesIndexable;
}
export interface EditToolsValues {
  drawer: {
    open: boolean;
    visibleControls: ControlType;
    codeDrawerWidth: number;
  };
  codeControl: {
    openTab: CodeControlTab;
  };
  fontControl: {
    selectedFont: Font | undefined; // move to config
  };
  playgroundSettings: {
    viewportColor?: string | undefined;
  };
}

export interface EditToolsActions {
  setDrawerOpen: (open: boolean) => void;
  setCodeDrawerWidth: (width: number) => void;
  setVisibleControls: (controls: ControlType) => void;
  setCodeControlTab: (tab: CodeControlTab) => void;
  resetEditTools: () => void;
  setSelectedFont: (font: Font) => void;
  setViewportBackgroundColor: (color: string | undefined) => void;
}

export type ToolsState = EditToolsValues & EditToolsActions;

export type ToolsStore = UseBoundStoreWithEqualityFn<StoreApi<ToolsState>>;
