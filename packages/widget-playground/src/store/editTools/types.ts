import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { StoreApi } from 'zustand';
import type { Font } from '../../providers';
import { WidgetTheme } from '@lifi/widget';

type ControlType = 'design' | 'code';
type CodeControlTab = 'config' | 'examples';

export interface ThemeItem {
  id: string;
  name: string;
  theme: WidgetTheme;
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
    selectedFont: Font | undefined;
  };
  themeControl: {
    selectedThemeId: string;
    widgetThemeItems: ThemeItem[];
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
  setAvailableThemes: (themeItems: ThemeItem[]) => void; //TODO to use for dynamic update of defalt
  setSelectedTheme: (selectedThemeId: string) => void;
}

export type ToolsState = EditToolsValues & EditToolsActions;

export type ToolsStore = UseBoundStoreWithEqualityFn<StoreApi<ToolsState>>;
