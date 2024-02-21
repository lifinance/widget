import type { StateCreator } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import type { ToolsState } from './types';

export const createEditToolsStore = () =>
  createWithEqualityFn<ToolsState>(
    persist(
      (set) => ({
        drawer: {
          open: true,
        },
        setDrawerOpen: (open) => {
          set({
            drawer: {
              open,
            },
          });
        },
      }),
      {
        name: `'li.fi-playground-tools`,
        version: 0,
        partialize: (state) => ({
          drawer: {
            open: state.drawer.open,
          },
        }),
      },
    ) as StateCreator<ToolsState, [], [], ToolsState>,
    Object.is,
  );
