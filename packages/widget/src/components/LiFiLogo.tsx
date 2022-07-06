import { CSSProperties } from 'react';
import { ReactComponent as LiFiFullLogo } from '../icons/LiFiFullLogo.svg';
import { ReactComponent as LiFiIconLogo } from '../icons/LiFiLogo.svg';

export const LiFiLogo: React.FC<{
  variant?: 'icon' | 'full';
  style?: CSSProperties;
}> = ({ variant = 'icon', style }) => {
  const Component = variant === 'icon' ? LiFiIconLogo : LiFiFullLogo;
  return <Component style={style} fill="currentColor" color="currentColor" />;
};
