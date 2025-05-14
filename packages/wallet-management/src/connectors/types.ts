import type { CreateConnectorFn as CreateBigmiConnectorFn } from '@bigmi/client'
import type { CreateConnectorFn } from 'wagmi'

export interface CreateConnectorFnExtended extends CreateConnectorFn {
  id: string
  displayName: string
}

export interface CreateBigmiConnectorFnExtended extends CreateBigmiConnectorFn {
  id: string
  displayName: string
}
