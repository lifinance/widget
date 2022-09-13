/* eslint-disable consistent-return */
import { useEffect } from 'react';
import { initSentry } from '../config/sentry';
import { name } from '../config/version';

export const useTelemetry = (disabled?: boolean) => {
  useEffect(() => {
    if (disabled) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[${name}] Enable crash reports and diagnostic data to be collected. This helps us to better understand how the widget is performing and where improvements need to be made.`,
        );
      }
    } else {
      initSentry(true);
      return () => {
        initSentry(false);
      };
    }
  }, [disabled]);
};
