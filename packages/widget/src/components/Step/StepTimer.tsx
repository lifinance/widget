import type { Step } from '@lifi/sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTimer } from 'react-timer-hook';

const getExpiryTimestamp = (step: Step) => {
  const confirmationTime =
    step.execution?.process.reduce((acc, process) => {
      const timeTakenForExternalAction = !!process.eoaConfirmationAt
        ? process.eoaConfirmationAt - process.startedAt
        : 0;

      return acc + timeTakenForExternalAction;
    }, 0) ?? 0;

  const firstProcess = step.execution?.process[0];

  // if no firstProcess or no firstProcess.doneAt or no firstProcess.eoaConfirmationAt
  // then don't start the timer and show the estimated time.
  // EOA confirmation is pending
  if (
    !firstProcess ||
    !firstProcess.doneAt ||
    !!(firstProcess.doneAt && !firstProcess.eoaConfirmationAt)
  ) {
    const expiryTimstamp = new Date(
      Date.now() + step.estimate.executionDuration * 1000,
    );

    return expiryTimstamp;
  }

  const { eoaConfirmationAt, doneAt } = firstProcess;

  const lastActivityTimestamp = eoaConfirmationAt ?? doneAt ?? Date.now();

  // confirmationTime is the time taken for the EOA to confirm the transaction
  // Add the confirmationTime to the lastActivityTimestamp to compensate the time taken for the EOA to confirm the transaction
  const expiryTimstamp = new Date(
    lastActivityTimestamp +
      step.estimate.executionDuration * 1000 +
      confirmationTime,
  );

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
