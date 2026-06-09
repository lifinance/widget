import type { WidgetTheme } from '@lifi/widget'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FormValues } from '../types.js'
import { defaultEditToolsValues } from './constants.js'
import type { ToolsState } from './types.js'

export const createEditToolsStore = (
  initialTheme?: WidgetTheme
): UseBoundStore<StoreApi<ToolsState>> =>
  create<ToolsState>()(
    persist(
      (set, get) => ({
        ...defaultEditToolsValues,
        setDrawerOpen: (open) => {
          set({
            drawer: {
              ...get().drawer,
              open,
            },
          })
        },
        resetEditTools: () => {
          const { drawer } = get()
          set({
            ...defaultEditToolsValues,
            drawer,
          })
        },
        setSelectedFont: (selectedFont) => {
          set({
            fontControl: {
              selectedFont,
            },
          })
        },
        setViewportBackgroundColor: (color, mode) => {
          set({
            playgroundSettings: {
              ...get().playgroundSettings,
              ...(mode === 'light'
                ? { viewportColorLight: color }
                : { viewportColorDark: color }),
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
        setIsDevView: (isDevView) => {
          set({
            isDevView,
          })
        },
        setWidgetEventMonitors: (allWidgetEventsOn, monitoredEvents) => {
          set({
            widgetEventsControl: {
              allWidgetEventsOn,
              monitoredEvents,
            },
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
        version: 3,
        migrate: () => ({}),
        partialize: (state) => ({
          drawer: {
            open: state.drawer.open,
          },
          playgroundSettings: {
            viewportColorLight: state.playgroundSettings?.viewportColorLight,
            viewportColorDark: state.playgroundSettings?.viewportColorDark,
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
                  state.setViewportBackgroundColor(undefined, 'light')
                  state.setViewportBackgroundColor(undefined, 'dark')
                }
              }
            }
          }
        },
      }
    )
  )
