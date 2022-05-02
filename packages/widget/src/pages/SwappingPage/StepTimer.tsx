import { Step } from '@lifinance/sdk';
import { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';

export const StepTimer: React.FC<{ step: Step }> = ({ step }) => {
  const [expiryTimestamp] = useState(
    () => new Date(Date.now() + step.estimate.executionDuration * 1000),
  );
  const [isExpired, setExpired] = useState(false);
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => setExpired(true),
  });

  useEffect(() => {
    if (isExpired) {
      return;
    }
    const isActionRequired = step.execution?.process.some(
      (process) =>
        process.status === 'ACTION_REQUIRED' ||
        process.status === 'CHAIN_SWITCH_REQUIRED',
    );
    if (isRunning && isActionRequired) {
      pause();
    } else if (!isRunning && !isActionRequired) {
      resume();
    }
  }, [expiryTimestamp, isExpired, isRunning, pause, resume, step]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</>;
};
