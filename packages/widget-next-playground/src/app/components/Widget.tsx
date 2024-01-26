import { LiFiWidget } from '@lifi/widget';
import { useEffect, useState } from 'react';
import { useConfig } from '../store';

export function Widget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { config } = useConfig();

  return mounted && config ? (
    <LiFiWidget config={config} integrator="li.fi-playground" />
  ) : null;
}
