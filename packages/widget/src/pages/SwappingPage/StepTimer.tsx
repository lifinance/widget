import { useTimer } from 'react-timer-hook';

export const StepTimer: React.FC<{ expiryTimestamp: Date }> = ({
  expiryTimestamp,
}) => {
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
    onExpire: () => console.warn('onExpire called'),
  });
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</>;
};
