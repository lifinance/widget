/* eslint-disable no-underscore-dangle */
import { create } from 'zustand';
import type { HeaderActionStore } from './types';

export const useHeaderActionStore = create<HeaderActionStore>((set, get) => ({
  setAction: (element) => {
    set(() => ({
      element,
    }));
    return get().removeAction;
  },
  removeAction: () => {
    set(() => ({
      element: null,
    }));
  },
}));
