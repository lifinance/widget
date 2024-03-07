import type { FC, SVGProps } from 'react';

export const VueLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={24}
    viewBox="0 0 27 24"
    {...props}
  >
    <path
      d="M16.617.004 13.5 5.547 10.383.004H0l13.5 23.992L27 .004Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#41b883',
        fillOpacity: 1,
      }}
    />
    <path
      d="M16.617.004 13.5 5.547 10.383.004H5.398L13.5 14.398 21.598.004Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#34495e',
        fillOpacity: 1,
      }}
    />
  </svg>
);
