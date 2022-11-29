import mitt from 'mitt';
import type { WidgetEvents } from '../types';

export const widgetEvents = mitt<WidgetEvents>();

export const useWidgetEvents = () => {
  return widgetEvents;
};
