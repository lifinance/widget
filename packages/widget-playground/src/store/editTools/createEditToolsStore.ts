import type { StateCreator } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';
import type { ThemeItem, ToolsState } from './types';
import { defaultDrawerWidth } from './constants';

interface EditToolsStoreProps {
  themeItems: ThemeItem[];
}

export const createEditToolsStore = ({ themeItems }: EditToolsStoreProps) =>
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
        themeControl: {
          selectedThemeId: 'default',
          widgetThemeItems: themeItems,
        },
        playgroundSettings: {
          viewportColor: undefined,
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
            themeControl: {
              ...get().themeControl,
              selectedThemeId: 'default',
            },
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
        setAvailableThemes: (themeItems) => {
          set({
            themeControl: {
              ...get().themeControl,
              widgetThemeItems: themeItems,
            },
          });
        },
        setSelectedTheme: (selectedThemeId) => {
          set({
            themeControl: {
              ...get().themeControl,
              selectedThemeId: selectedThemeId,
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
          themeControl: {
            selectedThemeId: state.themeControl?.selectedThemeId || 'default',
          },
          playgroundSettings: {
            viewportColor: state.playgroundSettings?.viewportColor,
          },
        }),
        onRehydrateStorage: () => {
          return (state) => {
            if (state) {
              state.setCodeDrawerWidth(defaultDrawerWidth);
              state.setAvailableThemes(themeItems);
            }
          };
        },
      },
    ) as StateCreator<ToolsState, [], [], ToolsState>,
    Object.is,
  );
