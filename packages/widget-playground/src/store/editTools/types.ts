import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { StoreApi } from 'zustand';
import type { Font } from '../../providers';
import type { Appearance, WidgetTheme } from '@lifi/widget';

type ControlType = 'design' | 'code';
type CodeControlTab = 'config' | 'examples';

export interface ThemeItem {
  id: string;
  name: string;
  theme: WidgetTheme;
  options?: {
    // sets and locks the appearance control to this appearance for a theme
    restrictAppearance?: Appearance;
  };
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
