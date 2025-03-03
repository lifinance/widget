export const formatTimer = ({
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: {
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
}): string => {
  const daysText = days > 0 ? (days < 10 ? `0${days}:` : `${days}:`) : ''
  const hoursText = hours > 0 ? (hours < 10 ? `0${hours}:` : `${hours}:`) : ''
  const minutesText = minutes < 10 ? `0${minutes}:` : `${minutes}:`
  const secondsText = seconds < 10 ? `0${seconds} ` : `${seconds}`
  return daysText + hoursText + minutesText + secondsText
}
