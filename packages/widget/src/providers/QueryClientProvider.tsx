import {
  QueryClientContext as TanstackQueryClientContext,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { use } from 'react'
import { queryClient } from '../config/queryClient.js'

export const QueryClientProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const existingQueryClient = use(TanstackQueryClientContext)
  return existingQueryClient ? (
    children
  ) : (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  )
}
