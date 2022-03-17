import React from 'react';
import { IconProps } from './types';

export function TickIcon({ completed }: IconProps) {
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
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="1.6"
        d="M2.5 7.8L6.625 12 13.5 5"
      />
    </svg>
  );
}
