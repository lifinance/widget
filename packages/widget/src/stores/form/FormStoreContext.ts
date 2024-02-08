import { createContext } from 'react';
import type { FormStoreStore } from './types';

export const FormStoreContext = createContext<FormStoreStore | null>(null);
