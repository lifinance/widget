import { StateCreator } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import { ToolsState } from './types';

export const createEditToolsStore = () =>
  createWithEqualityFn<ToolsState>(
    persist(
      (set) => ({
        drawer: {
          open: false,
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
