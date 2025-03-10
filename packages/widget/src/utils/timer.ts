import type { LiFiStepExtended, RouteExtended } from '@lifi/sdk'

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

export const getStepTotalDuration = (step: LiFiStepExtended) => {
  return (
    step.execution?.process?.reduce((acc, process) => {
      let duration = 0
      if (process.status === 'DONE' && process.doneAt) {
        duration = process.doneAt - process.startedAt
      }
      if (process.status === 'PENDING') {
        duration = Date.now() - process.startedAt
      }

      return duration + acc
    }, 0) || 0
  )
}

export const getRouteTotalDuration = (route: RouteExtended) => {
  return (
    route?.steps?.reduce((total, step) => {
      return total + getStepTotalDuration(step)
    }, 0) || 0
  )
}
