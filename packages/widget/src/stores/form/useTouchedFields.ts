import { useFormStore } from './FormStore';
import { shallow } from 'zustand/shallow';

export const useTouchedFields = () => {
  const touchedFields = useFormStore((store) => store.touchedFields, shallow);

  return touchedFields;
};
