import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { StoreApi } from 'zustand';
import type { Font } from '../../providers';

type ControlType = 'design' | 'code';
type CodeControlTab = 'config' | 'examples';
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
  playgroundSettings: {
    viewportColor?: string;
  };
}

export interface EditToolsActions {
  setDrawerOpen: (open: boolean) => void;
  setCodeDrawerWidth: (width: number) => void;
  setVisibleControls: (controls: ControlType) => void;
  setCodeControlTab: (tab: CodeControlTab) => void;
  resetEditTools: () => void;
  setSelectedFont: (font: Font) => void;
  setViewportBackgroundColor: (color: string) => void;
}

export type ToolsState = EditToolsValues & EditToolsActions;

export type ToolsStore = UseBoundStoreWithEqualityFn<StoreApi<ToolsState>>;
