import type { WidgetTheme } from '@lifi/widget';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import type { FormValues } from '../widgetConfig/types';
import { defaultDrawerWidth } from './constants';
import type { ToolsState } from './types';

export const createEditToolsStore = (initialTheme?: WidgetTheme) =>
  createWithEqualityFn<ToolsState>(
    persist(
      (set, get) => ({
        formValues: undefined,
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
        headerAndFooterControl: {
          showMockHeader: false,
          showMockFooter: false,
          isFooterFixed: false,
        },
        layoutControl: {
          selectedLayoutId: 'default',
        },
        isDevView: false,
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
        setHeaderVisibility: (show) => {
          set({
            headerAndFooterControl: {
              ...get().headerAndFooterControl,
              showMockHeader: show,
            },
          });
        },
        setFooterVisibility: (show) => {
          set({
            headerAndFooterControl: {
              ...get().headerAndFooterControl,
              showMockFooter: show,
            },
          });
        },
        setFixedFooter: (isFixed) => {
          set({
            headerAndFooterControl: {
              ...get().headerAndFooterControl,
              isFooterFixed: isFixed,
            },
          });
        },
        setSelectedLayoutId: (selectedLayoutId) => {
          set({
            layoutControl: {
              ...get().layoutControl,
              selectedLayoutId,
            },
          });
        },
        setIsDevView: (isDevView) => {
          set({
            isDevView,
          });
        },
        setFormValues: (formValues: FormValues) => {
          set({
            formValues,
          });
        },
      }),
      {
        name: 'li.fi-playground-tools',
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
