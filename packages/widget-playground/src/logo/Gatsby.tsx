import type { FC, SVGProps } from 'react';

export const GatsbyLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={38} height={38} {...props}>
    <path
      d="M38 19c0 10.492-8.508 19-19 19S0 29.492 0 19 8.508 0 19 0s19 8.508 19 19Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#639',
        fillOpacity: 1,
      }}
    />
    <path
      d="M8.414 29.586C5.563 26.734 4.07 22.938 4.07 19.27l14.793 14.66c-3.8-.137-7.597-1.492-10.449-4.344Zm13.844 3.934L4.48 15.742C5.973 9.094 11.941 4.07 19 4.07c5.02 0 9.363 2.446 12.078 6.11l-2.035 1.761C26.734 8.821 23.07 6.785 19 6.785c-5.293 0-9.77 3.395-11.535 8.145L23.07 30.535c3.938-1.355 6.922-4.75 7.871-8.82H24.43V19h9.5c0 7.059-5.024 13.027-11.672 14.52Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#fff',
        fillOpacity: 1,
      }}
    />
  </svg>
);
