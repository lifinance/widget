import type { Emitter } from 'mitt';
import mitt from 'mitt';
import create from 'zustand';
import type { WidgetEvents } from '../types';

const emitterStore = create<Emitter<WidgetEvents>>()(() =>
  mitt<WidgetEvents>(),
);

export const useWidgetEvents = () => {
  return emitterStore();
};
