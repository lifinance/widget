import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { StoreApi } from 'zustand';

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
}

export interface EditToolsActions {
  setDrawerOpen: (open: boolean) => void;
  setCodeDrawerWidth: (width: number) => void;
  setVisibleControls: (controls: ControlType) => void;
  setCodeControlTab: (tab: CodeControlTab) => void;
  resetEditTools: () => void;
}

export type ToolsState = EditToolsValues & EditToolsActions;

export type ToolsStore = UseBoundStoreWithEqualityFn<StoreApi<ToolsState>>;
