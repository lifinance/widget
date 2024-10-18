export enum ElementId {
  AppExpandedContainer = 'widget-app-expanded-container',
  Header = 'widget-header',
  RelativeContainer = 'widget-relative-container',
  ScrollableContainer = 'widget-scrollable-container',
}

export const createElementId = (ElementId: ElementId, elementId: string) =>
  elementId ? `${ElementId}-${elementId}` : ElementId

// NOTE: The getter functions here are often used with code that can be effected by css changes in the
//   AppExpandedContainer, RelativeContainer and CssBaselineContainer components as defined in AppContainer.ts

export const getAppContainer = (elementId: string) =>
  document.getElementById(
    createElementId(ElementId.AppExpandedContainer, elementId)
  )

export const getRelativeContainer = (elementId: string) =>
  document.getElementById(
    createElementId(ElementId.RelativeContainer, elementId)
  )

export const getScrollableContainer = (elementId: string) =>
  document.getElementById(
    createElementId(ElementId.ScrollableContainer, elementId)
  )

export const getHeaderElement = (elementId: string) =>
  document.getElementById(createElementId(ElementId.Header, elementId))
