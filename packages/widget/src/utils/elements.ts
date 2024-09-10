export enum ElementId {
  AppExpandedContainer = 'widget-app-expanded-container',
  Header = 'widget-header',
  RelativeContainer = 'widget-relative-container',
  ScrollableContainer = 'widget-scrollable-container',
  TokenList = 'token-list',
}

export const createElementId = (ElementId: ElementId, elementId: string) =>
  elementId ? `${ElementId}-${elementId}` : ElementId;
