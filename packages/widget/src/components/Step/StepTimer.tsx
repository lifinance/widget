import type { LifiStep, Step } from '@lifi/sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTimer } from 'react-timer-hook';

const getExpiryTimestamp = (step: LifiStep) => {
  const firstProcess = step.execution?.process[0];

  const processInitTimestamp = firstProcess?.approvedAt ?? firstProcess?.doneAt;

  if (!processInitTimestamp) {
    return new Date(Date.now() + step.estimate.executionDuration * 1000);
  }

  let latestActionStepInitTimestamp = 0;

  // total time user took to approve all the steps where needed
  const totalApprovalTime =
    step.execution?.process.reduce((timeConsumed, process, index) => {
      const { startedAt, approvedAt } = process;

      if (process.status === 'ACTION_REQUIRED') {
        latestActionStepInitTimestamp = startedAt;
      }

      if (approvedAt) {
        // time taken from metamask prompt to user approval
        // startedAt    -> metamask prompt
        // userApproval -> approvedAt
        return timeConsumed + approvedAt - startedAt;
      }

      return timeConsumed;
    }, 0) ?? 0;

  // end timestamp to consider for calculation when the user has not approved
  const endTimestamp = !!latestActionStepInitTimestamp
    ? latestActionStepInitTimestamp
    : Date.now();

  // total time from the first process to the end timestamp including the userApprovals
  const totalTimeFromInitTimestamp =
    endTimestamp - (firstProcess?.startedAt ?? 0);

  // subtract the userApprovals time
  const remainingExecutionTime = totalTimeFromInitTimestamp - totalApprovalTime;

  // actual remaining time to consider for the timer based on estimated time
  const actualRemainingDuration =
    step.estimate.executionDuration * 1000 - remainingExecutionTime;

  return new Date(Date.now() + actualRemainingDuration);
};

export const StepTimer: React.FC<{
  step: LifiStep;
  hideInProgress?: boolean;
}> = ({ step, hideInProgress }) => {
  console.log({ step });

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
