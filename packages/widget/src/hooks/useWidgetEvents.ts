import { EventEmitter } from 'events';
import create from 'zustand';

const emitterStore = create<EventEmitter>()(() => new EventEmitter());

export const useWidgetEvents = () => {
  return emitterStore();
};
