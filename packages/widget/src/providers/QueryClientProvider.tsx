import {
  QueryClientContext as TanstackQueryClientContext,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { useContext } from 'react'
import { queryClient } from '../config/queryClient.js'

export const QueryClientProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const existingQueryClient = useContext(TanstackQueryClientContext)
  return existingQueryClient ? (
    children
  ) : (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  )
}
