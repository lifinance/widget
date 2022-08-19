/* eslint-disable no-underscore-dangle */
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { HeaderActionState, HeaderActionStore } from './types';

export const useHeaderActionStore = create<HeaderActionStore>()(
  immer((set, get) => ({
    setAction: (element) => {
      set((state: HeaderActionState) => {
        state.element = element;
      });
      return get().removeAction;
    },
    removeAction: () => {
      set((state: HeaderActionState) => {
        state.element = null;
      });
    },
  })),
);

export const useSetHeaderAction = () => {
  return useHeaderActionStore((state) => state.setAction);
};
