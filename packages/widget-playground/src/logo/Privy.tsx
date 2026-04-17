import type { FC, SVGProps } from 'react'

export const PrivyLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    viewBox="0 0 200 200"
    {...props}
  >
    <title>Privy</title>
    <rect width="200" height="200" rx="20" fill="#F77E6D" />
    <g transform="translate(0,200) scale(0.1,-0.1)" fill="#000" stroke="none">
      <path d="M903 1575 c-167 -36 -303 -170 -348 -342 -19 -73 -19 -121 1 -202 21 -83 41 -123 98 -193 89 -110 221 -164 376 -156 109 7 191 43 276 120 276 256 137 712 -237 777 -79 13 -87 13 -166 -4z" />
      <path d="M821 538 c-74 -10 -131 -34 -131 -54 0 -27 50 -45 166 -61 100 -13 139 -13 244 -3 119 11 210 36 210 58 0 56 -280 90 -489 60z" />
    </g>
  </svg>
)
