export function validateExpiryTimestamp(expiryTimestamp: Date): boolean {
  const isValid = new Date(expiryTimestamp).getTime() > 0
  if (!isValid) {
    console.warn('useTimer Invalid expiryTimestamp settings', expiryTimestamp)
  }
  return isValid
}

export function validateOnExpire(onExpire: () => void): boolean {
  const isValid = onExpire && typeof onExpire === 'function'
  if (onExpire && !isValid) {
    console.warn('useTimer Invalid onExpire settings function', onExpire)
  }
  return isValid
}
