export enum ElementId {
  ScrollableContainer = 'widget-scrollable-container',
  Header = 'widget-header',
}

export const createElementId = (ElementId: ElementId, elementId: string) =>
  `${ElementId}-${elementId}`;
