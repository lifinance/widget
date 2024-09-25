import _mitt from 'mitt';
import type { WalletManagementEvents } from '../types/events.js';
// https://github.com/developit/mitt/issues/191
const mitt = _mitt as unknown as typeof _mitt.default;

export const widgetEvents = mitt<WalletManagementEvents>();

export const useWalletManagementEvents = () => {
  return widgetEvents;
};
