import type { WidgetTheme } from '@lifi/widget'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FormValues } from '../types.js'
import type { ToolsState } from './types.js'

export const createEditToolsStore = (
  initialTheme?: WidgetTheme
): UseBoundStore<StoreApi<ToolsState>> =>
  create<ToolsState>()(
    persist(
      (set, get) => ({
        formValues: undefined,
        drawer: {
          open: true,
        },
        fontControl: {
          selectedFont: undefined,
        },
        playgroundSettings: {
          viewportColor: undefined,
        },
        skeletonControl: {
          show: false,
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
          })
        },
        resetEditTools: () => {
          set({
            playgroundSettings: {
              viewportColor: undefined,
            },
          })
        },
        setSelectedFont: (selectedFont) => {
          set({
            fontControl: {
              selectedFont,
            },
          })
        },
        setViewportBackgroundColor: (viewportColor) => {
          set({
            playgroundSettings: {
              ...get().playgroundSettings,
              viewportColor,
            },
          })
        },
        setSkeletonShow: (show) => {
          set({
            skeletonControl: {
              show,
            },
          })
        },
        setHeaderVisibility: (show) => {
          set({
            headerAndFooterControl: {
              ...get().headerAndFooterControl,
              showMockHeader: show,
            },
          })
        },
        setFooterVisibility: (show) => {
          set({
            headerAndFooterControl: {
              ...get().headerAndFooterControl,
              showMockFooter: show,
            },
          })
        },
        setFixedFooter: (isFixed) => {
          set({
            headerAndFooterControl: {
              ...get().headerAndFooterControl,
              isFooterFixed: isFixed,
            },
          })
        },
        setSelectedLayoutId: (selectedLayoutId) => {
          set({
            layoutControl: {
              ...get().layoutControl,
              selectedLayoutId,
            },
          })
        },
        setIsDevView: (isDevView) => {
          set({
            isDevView,
          })
        },
        setFormValues: (formValues: FormValues) => {
          set({
            formValues,
          })
        },
      }),
      {
        name: 'li.fi-playground-tools',
        version: 2,
        partialize: (state) => ({
          drawer: {
            open: state.drawer.open,
          },
          playgroundSettings: {
            viewportColor: state.playgroundSettings?.viewportColor,
          },
        }),
        onRehydrateStorage: () => {
          return (state) => {
            if (state) {
              if (initialTheme) {
                if (
                  !initialTheme.colorSchemes?.light?.palette?.playground
                    ?.main &&
                  !initialTheme.colorSchemes?.dark?.palette?.playground?.main
                ) {
                  state.setViewportBackgroundColor(undefined)
                }
              }
            }
          }
        },
      }
    )
  )
