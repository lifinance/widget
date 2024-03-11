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
        codeControl: {
          openTab: 'config',
        },
        fontControl: {
          selectedFont: undefined,
        },
        playgroundSettings: {
          viewportBackground: undefined,
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

          if (visibleControls !== 'code') {
            get().setCodeDrawerWidth(defaultDrawerWidth);
          }
        },
        setCodeControlTab: (openTab) => {
          set({
            codeControl: {
              ...get().codeControl,
              openTab,
            },
          });

          if (openTab !== 'config') {
            get().setCodeDrawerWidth(defaultDrawerWidth);
          }
        },
        resetEditTools: () => {
          set({
            drawer: {
              open: true,
              visibleControls: 'design',
              codeDrawerWidth: defaultDrawerWidth,
            },
            codeControl: {
              openTab: 'config',
            },
          });
        },
        setSelectedFont: (selectedFont) => {
          set({
            fontControl: {
              selectedFont,
            },
          });
        },
        setViewportBackgroundColor: (viewportColor?: string) => {
          set({
            playgroundSettings: {
              ...get().playgroundSettings,
              viewportColor,
            },
          });
        },
      }),
      {
        name: `'li.fi-playground-tools`,
        version: 1,
        partialize: (state) => ({
          drawer: {
            ...state.drawer,
            open: state.drawer.open,
            visibleControls: state.drawer.visibleControls || 'design',
          },
        }),
      },
    ) as StateCreator<ToolsState, [], [], ToolsState>,
    Object.is,
  );
