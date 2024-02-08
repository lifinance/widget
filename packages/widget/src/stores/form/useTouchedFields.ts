import { shallow } from 'zustand/shallow';
import { useFormStore } from './useFormStore.js';

export const useTouchedFields = () => {
  const touchedFields = useFormStore((store) => store.touchedFields, shallow);

  return touchedFields;
};
