import type { RouteExtended } from '@lifi/sdk'

export const formatTimer = ({
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  locale = 'en',
}: {
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  locale?: string
}): string => {
  if (typeof (Intl as any).DurationFormat === 'function') {
    return new (Intl as any).DurationFormat(locale, {
      style: 'digital',
      hours: '2-digit',
      hoursDisplay: 'auto',
    }).format({
      days,
      hours,
      minutes,
      seconds,
    })
  }

  return ''
}

export const getRouteTotalDuration = (route: RouteExtended) => {
  return (
    route?.steps?.reduce((total, step) => {
      let duration = 0
      if (step.execution?.status === 'DONE' && step.execution?.doneAt) {
        duration = step.execution.doneAt - step.execution.startedAt
      }
      if (step.execution?.status === 'PENDING') {
        duration = Date.now() - step.execution?.startedAt
      }
      return duration + total
    }, 0) || 0
  )
}
