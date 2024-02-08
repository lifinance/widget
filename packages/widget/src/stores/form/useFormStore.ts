import { useContext } from 'react';
import { shallow } from 'zustand/shallow';
import { FormStoreContext } from './FormStoreContext.js';
import type { FormValuesState } from './types.js';

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
