import type { Step } from '@lifi/sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTimer } from 'react-timer-hook';

const getExpiryTimestamp = (step: Step) => {
  const firstProcess = step.execution?.process[0];

  const beginningTimestamp =
    firstProcess?.eoaConfirmationAt ?? firstProcess?.doneAt;

  if (!beginningTimestamp) {
    return new Date(Date.now() + step.estimate.executionDuration * 1000);
  }

  const timeSpentInExecution =
    step.execution?.process.reduce((timeConsumed, process, index) => {
      if (index === 0) {
        // skip the first process as it is already accounted for
        return timeConsumed;
      }

      const { startedAt, doneAt, eoaConfirmationAt, failedAt } = process;

      // ClonedTimeConsumed is used to include the beginningTimestamp in the calculation
      let clonedTimeConsumed = timeConsumed;

      if (index === 1) {
        clonedTimeConsumed += startedAt - beginningTimestamp;
      }
      if (process.status !== 'ACTION_REQUIRED') {
        // if eoaConfirmationAt is set, then doneAt - eoaConfirmationAt is the time spent in execution
        // since startedAt -> eoaConfirmationAt is the time spent in waiting for the user to confirm the transaction

        if (eoaConfirmationAt) {
          if (doneAt) {
            console.log('eoaConfirmationAt', clonedTimeConsumed);
            return clonedTimeConsumed + doneAt - eoaConfirmationAt;
          }
        } else {
          // if eoaConfirmationAt is not set, then doneAt - startedAt is the time spent in execution
          // no user intervention was required
          if (doneAt && !failedAt) {
            // if the process failed, then the time for the previous process is not updated.
            // hence, the time spent in execution will not be considered
            console.log('doneAt', clonedTimeConsumed);
            return clonedTimeConsumed + doneAt - startedAt;
          }
        }

        return clonedTimeConsumed;
      }

      return clonedTimeConsumed;
    }, 0) ?? 0;

  // timeSpentInExecution is in milliseconds
  const remainingTimeInSeconds =
    step.estimate.executionDuration * 1000 - timeSpentInExecution;

  console.log(
    'remainingTimeInSeconds',
    remainingTimeInSeconds,
    step.estimate.executionDuration * 1000,
    timeSpentInExecution,
  );

  const expiryTimstamp = new Date(Date.now() + remainingTimeInSeconds);

  return expiryTimstamp;
};

export const StepTimer: React.FC<{ step: Step; hideInProgress?: boolean }> = ({
  step,
  hideInProgress,
}) => {
  const { t } = useTranslation();
  const [isExpired, setExpired] = useState(false);
  const [isExecutionStarted, setExecutionStarted] = useState(!!step.execution);
  const [expiryTimestamp] = useState(() => getExpiryTimestamp(step));
  const { seconds, minutes, isRunning, pause, resume, restart } = useTimer({
    autoStart: false,
    expiryTimestamp,
    onExpire: () => setExpired(true),
  });

  useEffect(() => {
    if (isExpired || !step.execution) {
      return;
    }
    if (!isExecutionStarted) {
      setExecutionStarted(true);
      restart(getExpiryTimestamp(step));
    }
    const shouldBePaused = step.execution.process.some(
      (process) =>
        process.status === 'ACTION_REQUIRED' || process.status === 'FAILED',
    );
    if (isRunning && shouldBePaused) {
      pause();
    } else if (!isRunning && !shouldBePaused) {
      resume();
    }
  }, [
    expiryTimestamp,
    isExecutionStarted,
    isExpired,
    isRunning,
    pause,
    restart,
    resume,
    step,
  ]);

  console.log([...(step.execution?.process ?? [])]);

  if (!isExecutionStarted) {
    return (
      <>
        {t('swap.estimatedTime', {
          value: Math.ceil(step.estimate.executionDuration / 60),
        })}
      </>
    );
  }

  const isTimerExpired = isExpired || (!minutes && !seconds);

  if (
    step.execution?.status === 'DONE' ||
    step.execution?.status === 'FAILED' ||
    (isTimerExpired && hideInProgress)
  ) {
    return null;
  }

  return isTimerExpired ? (
    <>{t('swap.inProgress')}</>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</>
  );
};
