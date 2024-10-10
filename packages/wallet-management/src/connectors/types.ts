import type { CreateConnectorFn } from 'wagmi'

export interface CreateConnectorFnExtended extends CreateConnectorFn {
  id: string
  displayName: string
}
