import { type Context, createContext } from 'react'
import type { FormStoreStore } from './types.js'

export const FormStoreContext: Context<FormStoreStore | null> =
  createContext<FormStoreStore | null>(null)
