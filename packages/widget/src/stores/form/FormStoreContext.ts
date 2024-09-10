import { createContext } from 'react';
import type { FormStoreStore } from './types.js';

export const FormStoreContext = createContext<FormStoreStore | null>(null);
