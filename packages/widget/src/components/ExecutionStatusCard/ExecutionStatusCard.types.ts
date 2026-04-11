import type { ReactNode } from 'react'
import type { ExecutionRow } from '../StepActions/executionRows.js'

export interface ExecutionStatusCardProps {
  /** Phase title. `undefined` until the first SDK action resolves a message. */
  title: string | undefined
  /** Status subtitle. `undefined` when the current action has no description. */
  description: string | undefined
  /** Completed step rows rendered in the animated checklist. */
  rows: ExecutionRow[]
  /** Animated icon well — either a `StatusIcon` or a custom-variant contract component. */
  iconSlot: ReactNode
  /** Card rendered below the main status card — `ExecutionDoneCard` on completion, `RouteTokens` while pending. */
  footerSlot: ReactNode
  /** Partner/VC component, rendered after the icon/title on `RouteExecutionStatus.Done`. */
  vcSlot?: ReactNode
}
