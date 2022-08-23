import type { Step } from '@lifi/sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTimer } from 'react-timer-hook';

const getExpiryTimestamp = (step: Step) =>
  new Date(
    (step.execution?.process[0]?.startedAt ?? Date.now()) +
      step.estimate.executionDuration * 1000,
  );

export const StepTimer: React.FC<{ step: Step }> = ({ step }) => {
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
        process.status === 'ACTION_REQUIRED' ||
        process.status === 'CHAIN_SWITCH_REQUIRED' ||
        process.status === 'FAILED',
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
          value: (step.estimate.executionDuration / 60).toFixed(0),
        })}
      </>
    );
  }
  if (
    step.execution?.status === 'DONE' ||
    step.execution?.status === 'FAILED'
  ) {
    return null;
  }
  return isExpired ? (
    <>{t('swap.inProgress')}</>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</>
  );
};
