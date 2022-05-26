import { useTheme } from '@mui/material/styles';
import { CSSProperties } from 'react';
import { ReactComponent as LiFiFullLogo } from '../icons/LiFiFullLogo.svg';
import { ReactComponent as LiFiIconLogo } from '../icons/LiFiLogo.svg';

export const LiFiLogo: React.FC<{
  variant?: 'icon' | 'full';
  style?: CSSProperties;
}> = ({ variant = 'icon', style }) => {
  const theme = useTheme();
  const Component = variant === 'icon' ? LiFiIconLogo : LiFiFullLogo;
  return (
    <Component
      style={style}
      fill={
        theme.palette.mode === 'light'
          ? theme.palette.common.black
          : theme.palette.common.white
      }
    />
  );
};
