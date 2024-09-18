export enum ElementId {
  AppExpandedContainer = 'widget-app-expanded-container',
  Header = 'widget-header',
  RelativeContainer = 'widget-relative-container',
  ScrollableContainer = 'widget-scrollable-container',
  TokenList = 'token-list',
}

export const createElementId = (ElementId: ElementId, elementId: string) =>
  elementId ? `${ElementId}-${elementId}` : ElementId;

export const getAppContainer = (elementId: string) =>
  document.getElementById(
    createElementId(ElementId.AppExpandedContainer, elementId),
  );

export const getRelativeContainer = (elementId: string) =>
  document.getElementById(
    createElementId(ElementId.RelativeContainer, elementId),
  );

export const getScrollableContainer = (elementId: string) =>
  document.getElementById(
    createElementId(ElementId.ScrollableContainer, elementId),
  );

export const getHeaderElement = (elementId: string) =>
  document.getElementById(createElementId(ElementId.Header, elementId));
