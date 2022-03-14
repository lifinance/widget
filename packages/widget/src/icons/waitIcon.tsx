import React from 'react';

export function WaitIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="#000"
        strokeWidth="1.6"
        d="M16.31 10.535l-3.797.578-1.398-3.577a3.2 3.2 0 01.21-2.765l1.638-2.838 7.275 4.2-1.639 2.838a3.2 3.2 0 01-2.29 1.564zm-4.822 2.352l1.398 3.578a3.2 3.2 0 01-.21 2.764l-1.638 2.838-7.275-4.2 1.639-2.838a3.2 3.2 0 012.29-1.563l3.796-.579z"
      />
      <path
        fill="#000"
        d="M18.465 8.804l-6.929-4-.75 1.299 1.965 4.598 4.964-.598.75-1.3zM8.75 17.63l-3.165.481 4.33 2.5-1.164-2.982z"
      />
    </svg>
  );
}
