import type { FC, SVGProps } from 'react';

export const RemixLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 27"
    {...props}
  >
    <path
      d="M.004 27v-4.191h7.805c1.304 0 1.586.945 1.586 1.507V27Zm22.937-6.18c.25 3.121.25 4.582.25 6.18H15.81c0-.348.007-.664.015-.988.02-1.004.04-2.047-.129-4.16-.218-3.09-1.578-3.778-4.082-3.778H.003V12.45h11.962c3.16 0 4.742-.941 4.742-3.43 0-2.19-1.582-3.515-4.742-3.515H.004V0H13.28c7.16 0 10.715 3.305 10.715 8.586 0 3.95-2.504 6.527-5.883 6.957 2.852.555 4.524 2.145 4.828 5.277Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#121212',
        fillOpacity: 1,
      }}
    />
  </svg>
);
