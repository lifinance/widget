import { create } from 'zustand';
import type { HeaderStore } from './types';

export const useHeaderStore = create<HeaderStore>((set, get) => ({
  setAction: (element) => {
    set(() => ({
      element,
    }));
    return get().removeAction;
  },
  setTitle: (title) => {
    set(() => ({
      title,
    }));
    return get().removeTitle;
  },
  removeAction: () => {
    set(() => ({
      element: null,
    }));
  },
  removeTitle: () => {
    set(() => ({
      title: undefined,
    }));
  },
}));
