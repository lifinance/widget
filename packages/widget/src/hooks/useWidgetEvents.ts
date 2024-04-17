import _mitt from 'mitt';
import type { WidgetEvents } from '../types/events.js';
// https://github.com/developit/mitt/issues/191
const mitt = _mitt as unknown as typeof _mitt.default;

export const widgetEvents = mitt<WidgetEvents>();

export const useWidgetEvents = () => {
  return widgetEvents;
};
