import { useContext } from 'react'
import { useShallow } from 'zustand/shallow'
import { FormStoreContext } from './FormStoreContext.js'
import type { FormValuesState } from './types.js'

export function useFormStore<T>(selector: (state: FormValuesState) => T): T {
  const useStore = useContext(FormStoreContext)

  if (!useStore) {
    throw new Error('You forgot to wrap your component in <FormStoreProvider>.')
  }

  return useStore(useShallow(selector))
}
