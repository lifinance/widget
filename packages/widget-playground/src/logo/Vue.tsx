import type { FC, SVGProps } from 'react';

export const VueLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 20"
    {...props}
  >
    <path
      d="M14.77.004 12 4.62 9.227.004H0l12 19.992L24 .004Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#41b883',
        fillOpacity: 1,
      }}
    />
    <path
      d="M14.77.004 12 4.62 9.227.004H4.8L12 12 19.2.004Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#34495e',
        fillOpacity: 1,
      }}
    />
  </svg>
);
