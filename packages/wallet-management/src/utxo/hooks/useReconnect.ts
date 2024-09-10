import { useEffect } from 'react';
import type { Config } from 'wagmi';
import { reconnect } from '../actions/reconnect.js';

export const useReconnect = (config: Config) => {
  useEffect(() => {
    reconnect(config);
  }, [config]);
};
