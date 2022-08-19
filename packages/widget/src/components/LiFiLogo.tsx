import type { CSSProperties } from 'react';
import { LiFiFullLogo, LiFiLogo as LiFiIconLogo } from '../icons';

export const LiFiLogo: React.FC<{
  variant?: 'icon' | 'full';
  style?: CSSProperties;
}> = ({ variant = 'icon', style }) => {
  const Component = variant === 'icon' ? LiFiIconLogo : LiFiFullLogo;
  return <Component style={style} fill="currentColor" color="currentColor" />;
};
