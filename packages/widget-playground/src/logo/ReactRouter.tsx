import type { FC, SVGProps } from 'react'

export const ReactRouterLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    viewBox="0 0 200 200"
    {...props}
  >
    <title>React Router</title>
    <g transform="translate(0,200) scale(0.1,-0.1)" fill="#000" stroke="none">
      <path d="M5 1988 c-3 -7 -4 -456 -3 -998 l3 -985 995 0 995 0 0 995 0 995 -993 3 c-789 2 -994 0 -997 -10z m1190 -502 c28 -7 68 -22 90 -34 197 -101 206 -418 14 -507 l-48 -22 44 -21 c80 -39 115 -140 115 -340 l0 -63 -135 3 -136 3 -5 109 c-10 210 -11 210 -331 214 l-243 3 0 105 0 104 236 0 c141 0 253 4 280 11 78 20 113 94 78 166 -34 69 -54 73 -341 73 l-253 0 0 105 0 105 293 0 c212 0 306 -4 342 -14z m-305 -846 c16 -16 20 -33 20 -80 l0 -60 -175 0 -175 0 0 80 0 80 155 0 c142 0 157 -2 175 -20z" />
    </g>
  </svg>
)
