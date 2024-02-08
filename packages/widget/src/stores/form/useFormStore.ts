import { useContext } from 'react';
import { shallow } from 'zustand/shallow';
import { FormStoreContext } from './FormStoreContext';
import type { FormValuesState } from './types';

export function useFormStore<T>(
  selector: (state: FormValuesState) => T,
  equalityFn = shallow,
): T {
  const useStore = useContext(FormStoreContext);

  if (!useStore) {
    throw new Error(
      `You forgot to wrap your component in <FormStoreProvider>.`,
    );
  }

  return useStore(selector, equalityFn);
}
