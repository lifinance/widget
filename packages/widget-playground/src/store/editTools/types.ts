import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { StoreApi } from 'zustand';

export interface EditToolsValues {
  drawer: {
    open: boolean;
  };
}

export interface EditToolsActions {
  setDrawerOpen: (open: boolean) => void;
}

export type ToolsState = EditToolsValues & EditToolsActions;

export type ToolsStore = UseBoundStoreWithEqualityFn<StoreApi<ToolsState>>;
