import type { FC, SVGProps } from 'react';

export const ViteLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 23"
    {...props}
  >
    <defs>
      <linearGradient
        id="a"
        x1={6}
        x2={235}
        y1={33}
        y2={344}
        gradientTransform="scale(.05854 .05693)"
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
        gradientTransform="scale(.05854 .05693)"
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
      d="M23.395 3.39 12.62 22.122a.591.591 0 0 1-1.016.004L.621 3.391c-.246-.418.121-.926.61-.844l10.78 1.875a.629.629 0 0 0 .212 0L22.777 2.55c.489-.086.86.418.618.84Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#a)',
      }}
    />
    <path
      d="M17.148.09 9.18 1.61a.286.286 0 0 0-.239.261l-.488 8.055a.29.29 0 0 0 .356.293l2.222-.496c.207-.047.395.129.352.332l-.66 3.14c-.043.211.16.39.37.328l1.372-.402c.21-.062.418.117.37.328l-1.046 4.934c-.066.308.356.476.531.21l.117-.175 6.497-12.605c.109-.211-.079-.454-.317-.41l-2.285.429c-.215.04-.398-.152-.336-.36L17.488.45a.29.29 0 0 0-.34-.36Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#b)',
      }}
    />
  </svg>
);
