import type { ExecutionAction, LiFiStep } from '@lifi/sdk'
import { useEffect, useRef, useState } from 'react'
import { useActionMessage } from './useActionMessage.js'

const DEFAULT_MIN_DISPLAY_MS = 2000

/** Stable key from step/action identity (type, status, substatus, error code) to compare messages. */
function actionMessageKey(_step: LiFiStep, action: ExecutionAction): string {
  const errorCode =
    action.status === 'FAILED' && action.error?.code !== undefined
      ? String(action.error.code)
      : ''
  return `${action.type}-${action.status}-${action.substatus ?? ''}-${errorCode}`
}

export type ActionMessageResult = { title?: string; message?: string }

/** True if the message has at least a title or body to show. */
function hasMessageContent(msg: ActionMessageResult) {
  return msg.title !== undefined || msg.message !== undefined
}

/**
 * Like useActionMessage but keeps the same message visible for at least
 * `minDisplayMs` before switching to a new one, so users have time to read.
 */
export const useStableActionMessage = (
  step?: LiFiStep,
  action?: ExecutionAction,
  minDisplayMs: number = DEFAULT_MIN_DISPLAY_MS
): ActionMessageResult => {
  const current = useActionMessage(step, action)
  const [displayed, setDisplayed] = useState<ActionMessageResult | undefined>(
    undefined
  )
  const displayedKeyRef = useRef<string | undefined>(undefined)
  const displayedAtRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const clearTimer = () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    }

    // No step/action: reset and clear any pending timer
    if (!step || !action) {
      setDisplayed(undefined)
      displayedKeyRef.current = undefined
      clearTimer()
      return
    }

    const currentKey = actionMessageKey(step, action)
    if (currentKey === displayedKeyRef.current) {
      return
    }

    const now = Date.now()
    const elapsed = displayedAtRef.current ? now - displayedAtRef.current : 0
    const isTerminalStatus =
      action.status === 'DONE' || action.status === 'FAILED'
    const minTimeElapsed =
      displayed === undefined || elapsed >= minDisplayMs || isTerminalStatus

    // First message, minimum display time passed, or terminal status (done/failed): show current immediately
    if (minTimeElapsed) {
      clearTimer()
      displayedAtRef.current = now
      displayedKeyRef.current = currentKey
      setDisplayed(hasMessageContent(current) ? current : undefined)
      return
    }

    // Within minimum display time: schedule switch to current after remaining time
    clearTimer()
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = undefined
      displayedAtRef.current = Date.now()
      displayedKeyRef.current = undefined
      setDisplayed(undefined)
    }, minDisplayMs - elapsed)

    return clearTimer
  }, [step, action, current, displayed, minDisplayMs])

  if (!step || !action) {
    return current
  }
  // Prefer stable displayed message; fall back to current when none is held
  return displayed ?? current
}
