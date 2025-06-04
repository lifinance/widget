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
    const time = new (Intl as any).DurationFormat(locale, {
      style: 'digital',
      hours: '2-digit',
      hoursDisplay: 'auto',
    }).format({
      days,
      hours,
      minutes,
      seconds,
    })
    // This handles a fixed bug with Webkit, and Safari
    // https://github.com/WebKit/WebKit/pull/38357
    // https://developer.apple.com/documentation/safari-release-notes/safari-18_4-release-notes#JavaScript
    //
    // Since most users haven't updated their browsers yet, they would have this issue
    // it should be safe to remove the check after a while.
    return time.replace(/^:, /, '')
  }

  return ''
}
