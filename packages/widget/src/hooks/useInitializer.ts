/* eslint-disable no-underscore-dangle */
import { checkPackageUpdates } from '@lifi/sdk';
import { useEffect } from 'react';
import { name, version } from '../config/version';
import { useTools } from './useTools';

export const useInitializer = () => {
  useTools();
  useEffect(() => {
    checkPackageUpdates(name, version);
  }, []);
};
