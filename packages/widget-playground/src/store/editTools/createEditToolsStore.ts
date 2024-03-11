import type { StateCreator } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import type { ToolsState } from './types';
import { defaultDrawerWidth } from './constants';

export const createEditToolsStore = () =>
  createWithEqualityFn<ToolsState>(
    persist(
      (set, get) => ({
        drawer: {
          open: true,
          visibleControls: 'design',
          codeDrawerWidth: defaultDrawerWidth,
        },
        setDrawerOpen: (open) => {
          set({
            drawer: {
              ...get().drawer,
              open,
            },
          });
        },
        setCodeDrawerWidth: (codeDrawerWidth) => {
          set({
            drawer: {
              ...get().drawer,
              codeDrawerWidth,
            },
          });
        },
        setVisibleControls: (visibleControls) => {
          set({
            drawer: {
              ...get().drawer,
              visibleControls,
            },
          });
        },
        resetEditTools: () => {
          set({
            drawer: {
              open: true,
              visibleControls: 'design',
              codeDrawerWidth: defaultDrawerWidth,
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
            codeDrawerWidth: state.drawer.codeDrawerWidth || defaultDrawerWidth,
            visibleControls: state.drawer.visibleControls || 'design',
          },
        }),
      },
    ) as StateCreator<ToolsState, [], [], ToolsState>,
    Object.is,
  );
