import type { FC, SVGProps } from 'react'

export const ViteLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    viewBox="0 0 30 29"
    {...props}
  >
    <title>Vite</title>
    <defs>
      <linearGradient
        id="a"
        x1={6}
        x2={235}
        y1={33}
        y2={344}
        gradientTransform="scale(.07317 .07178)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#41d1ff',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#bd34fe',
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <linearGradient
        id="b"
        x1={194.651}
        x2={236.076}
        y1={8.818}
        y2={292.989}
        gradientTransform="scale(.07317 .07178)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#ffea83',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={0.083}
          style={{
            stopColor: '#ffdd35',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ffa800',
            stopOpacity: 1,
          }}
        />
      </linearGradient>
    </defs>
    <path
      d="M29.242 4.273 15.777 27.891a.737.737 0 0 1-1.273.004L.774 4.273c-.305-.527.156-1.168.765-1.062l13.477 2.367a.84.84 0 0 0 .261-.004l13.196-2.36c.609-.109 1.07.528.77 1.06Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#a)',
      }}
    />
    <path
      d="m21.438.113-9.965 1.914a.357.357 0 0 0-.293.332l-.614 10.157a.36.36 0 0 0 .446.367l2.773-.625a.362.362 0 0 1 .442.422l-.825 3.957c-.054.265.2.496.465.414l1.715-.508a.362.362 0 0 1 .465.414l-1.309 6.219c-.082.39.446.601.664.27l.145-.223 8.121-15.895c.137-.266-.098-.57-.398-.516l-2.856.543a.36.36 0 0 1-.418-.453L21.86.566a.364.364 0 0 0-.422-.453Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#b)',
      }}
    />
  </svg>
)
