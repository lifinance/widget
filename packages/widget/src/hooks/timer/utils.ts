export function getTimeFromSeconds(secs: number) {
  const totalSeconds = Math.ceil(secs);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
  };
}

export function getSecondsFromExpiry(expiry: Date, shouldRound?: boolean) {
  const now = new Date().getTime();
  const milliSecondsDistance = expiry.getTime() - now;
  if (milliSecondsDistance > 0) {
    const val = milliSecondsDistance / 1000;
    return shouldRound ? Math.round(val) : val;
  }
  return 0;
}

export function validateExpiryTimestamp(expiryTimestamp: Date) {
  const isValid = new Date(expiryTimestamp).getTime() > 0;
  if (!isValid) {
    console.warn('useTimer Invalid expiryTimestamp settings', expiryTimestamp); // eslint-disable-line
  }
  return isValid;
}

export function validateOnExpire(onExpire: Function) {
  const isValid = onExpire && typeof onExpire === 'function';
  if (onExpire && !isValid) {
    console.warn('useTimer Invalid onExpire settings function', onExpire);
  }
  return isValid;
}

export function getDelayFromExpiryTimestamp(
  expiryTimestamp: Date,
  defaultDelay: number,
) {
  if (!validateExpiryTimestamp(expiryTimestamp)) {
    return 0;
  }

  const seconds = getSecondsFromExpiry(expiryTimestamp);
  const extraMilliSeconds = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return extraMilliSeconds > 0 ? extraMilliSeconds : defaultDelay;
}
