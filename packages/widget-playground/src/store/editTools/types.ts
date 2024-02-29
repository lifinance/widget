import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { StoreApi } from 'zustand';

type ControlType = 'design' | 'code';
export interface EditToolsValues {
  drawer: {
    open: boolean;
    visibleControls: ControlType;
    codeDrawerWidth: number;
  };
}

export interface EditToolsActions {
  setDrawerOpen: (open: boolean) => void;
  setCodeDrawerWidth: (width: number) => void;
  setVisibleControls: (controls: ControlType) => void;
  resetEditTools: () => void;
}

export type ToolsState = EditToolsValues & EditToolsActions;

export type ToolsStore = UseBoundStoreWithEqualityFn<StoreApi<ToolsState>>;
