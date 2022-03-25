import React from 'react';
import { IconProps } from './types';

export function SignIcon({ completed }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke={completed ? '#fff' : '#000'}
        strokeLinecap="round"
        strokeWidth="1.6"
        d="M13.759 8.23A4.234 4.234 0 0010.762 1a4.24 4.24 0 00-2.997 1.24L3 7.004V13h6l4.759-4.77z"
      />
      <path
        fill={completed ? '#fff' : '#000'}
        d="M10.434 4.434l-10 10 1.132 1.132 10-10-1.132-1.132z"
      />
    </svg>
  );
}
