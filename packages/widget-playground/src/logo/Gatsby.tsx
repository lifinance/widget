import type { FC, SVGProps } from 'react';
export const GatsbyLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path
      d="M24 12c0 6.629-5.371 12-12 12S0 18.629 0 12 5.371 0 12 0s12 5.371 12 12Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#639',
        fillOpacity: 1,
      }}
    />
    <path
      d="M5.313 18.688c-1.797-1.801-2.743-4.204-2.743-6.516l9.344 9.258c-2.398-.086-4.8-.946-6.601-2.742Zm8.746 2.484L2.829 9.942C3.768 5.741 7.542 2.57 12 2.57c3.172 0 5.914 1.543 7.629 3.86l-1.285 1.113C16.887 5.57 14.57 4.285 12 4.285c-3.344 0-6.172 2.145-7.285 5.145l9.855 9.855c2.489-.855 4.371-3 4.973-5.57H15.43V12h6c0 4.457-3.172 8.23-7.371 9.172Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#fff',
        fillOpacity: 1,
      }}
    />
  </svg>
);
