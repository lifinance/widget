import type { StateCreator } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import type { WidgetTheme } from '@lifi/widget';
import type { ToolsState } from './types';
import { defaultDrawerWidth } from './constants';

export const createEditToolsStore = (initialTheme?: WidgetTheme) =>
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
          viewportColor: undefined,
        },
        skeletonControl: {
          show: false,
          sideBySide: false,
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
            playgroundSettings: {
              viewportColor: undefined,
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
        setViewportBackgroundColor: (viewportColor) => {
          set({
            playgroundSettings: {
              ...get().playgroundSettings,
              viewportColor,
            },
          });
        },
        setSkeletonShow: (show) => {
          set({
            skeletonControl: {
              show,
              sideBySide: !show ? false : get().skeletonControl.sideBySide,
            },
          });
        },
        setSkeletonSideBySide: (sideBySide) => {
          set({
            skeletonControl: {
              sideBySide,
              show: sideBySide ? true : get().skeletonControl.show,
            },
          });
        },
      }),
      {
        name: `'li.fi-playground-tools`,
        version: 1,
        partialize: (state) => ({
          drawer: {
            open: state.drawer.open,
            visibleControls: state.drawer.visibleControls || 'design',
          },
          playgroundSettings: {
            viewportColor: state.playgroundSettings?.viewportColor,
          },
        }),
        onRehydrateStorage: () => {
          return (state) => {
            if (state) {
              state.setCodeDrawerWidth(defaultDrawerWidth);

              if (initialTheme) {
                if (!initialTheme.playground?.background) {
                  state.setViewportBackgroundColor(undefined);
                }
              }
            }
          };
        },
      },
    ) as StateCreator<ToolsState, [], [], ToolsState>,
    Object.is,
  );
