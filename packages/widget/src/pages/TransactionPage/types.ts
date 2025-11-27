import type { Route } from '@lifi/sdk'
import type { BaseTransactionButtonProps } from '../../components/BaseTransactionButton/types'

export interface StartTransactionButtonProps
  extends BaseTransactionButtonProps {
  route?: Route
}
