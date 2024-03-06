import type { FC, SVGProps } from 'react';

export const RainbowKitLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <defs>
      <radialGradient
        id="b"
        cx={0}
        cy={0}
        r={1}
        fx={0}
        fy={0}
        gradientTransform="rotate(-90 12 6.8) scale(14.8)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0.77}
          style={{
            stopColor: '#ff4000',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#8754c9',
            stopOpacity: 1,
          }}
        />
      </radialGradient>
      <radialGradient
        id="e"
        cx={0}
        cy={0}
        r={1}
        fx={0}
        fy={0}
        gradientTransform="rotate(-90 12 6.8) scale(11.6)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0.724}
          style={{
            stopColor: '#fff700',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ff9901',
            stopOpacity: 1,
          }}
        />
      </radialGradient>
      <radialGradient
        id="h"
        cx={0}
        cy={0}
        r={1}
        fx={0}
        fy={0}
        gradientTransform="rotate(-90 12 6.8) scale(8.4)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0.595}
          style={{
            stopColor: '#0af',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#01da40',
            stopOpacity: 1,
          }}
        />
      </radialGradient>
      <radialGradient
        id="i"
        cx={0}
        cy={0}
        r={1}
        fx={0}
        fy={0}
        gradientTransform="matrix(3.4 0 0 9.06666 10.2 19.4)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#0af',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#01da40',
            stopOpacity: 1,
          }}
        />
      </radialGradient>
      <radialGradient
        id="j"
        cx={0}
        cy={0}
        r={1}
        fx={0}
        fy={0}
        gradientTransform="matrix(0 -3.4 64.474 0 4.6 13.8)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#0af',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#01da40',
            stopOpacity: 1,
          }}
        />
      </radialGradient>
      <linearGradient
        id="a"
        x1={60}
        x2={60}
        y1={0}
        y2={120}
        gradientTransform="scale(.2)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#174299',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#001e59',
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <linearGradient
        id="c"
        x1={83}
        x2={100}
        y1={97}
        y2={97}
        gradientTransform="scale(.2)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#ff4000',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#8754c9',
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <linearGradient
        id="d"
        x1={23}
        x2={23}
        y1={20}
        y2={37}
        gradientTransform="scale(.2)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#8754c9',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ff4000',
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <linearGradient
        id="f"
        x1={68}
        x2={84}
        y1={97}
        y2={97}
        gradientTransform="scale(.2)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#fff700',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ff9901',
            stopOpacity: 1,
          }}
        />
      </linearGradient>
      <linearGradient
        id="g"
        x1={23}
        x2={23}
        y1={52}
        y2={36}
        gradientTransform="scale(.2)"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#fff700',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ff9901',
            stopOpacity: 1,
          }}
        />
      </linearGradient>
    </defs>
    <path
      d="M0 0h24v24H0z"
      style={{
        fill: 'url(#a)',
        stroke: 'none',
      }}
    />
    <path
      d="M4 7.602h1.2c6.187 0 11.198 5.011 11.198 11.199V20h2.403c.66 0 1.199-.54 1.199-1.2C20 10.626 13.375 4 5.2 4 4.54 4 4 4.54 4 5.2Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#b)',
      }}
    />
    <path
      d="M16.8 18.8H20c0 .66-.54 1.2-1.2 1.2h-2Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#c)',
      }}
    />
    <path
      d="M5.2 4v3.2H4v-2C4 4.54 4.54 4 5.2 4Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#d)',
      }}
    />
    <path
      d="M4 7.2h1.2c6.405 0 11.6 5.195 11.6 11.6V20h-3.6v-1.2a8 8 0 0 0-8-8H4Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#e)',
      }}
    />
    <path
      d="M13.602 18.8H16.8V20h-3.2Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#f)',
      }}
    />
    <path
      d="M4 10.398V7.2h1.2v3.2Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#g)',
      }}
    />
    <path
      d="M4 12.398c0 .665.54 1.204 1.2 1.204a5.2 5.2 0 0 1 5.198 5.199c0 .66.54 1.199 1.204 1.199h2v-1.2a8.402 8.402 0 0 0-8.403-8.402H4Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#h)',
      }}
    />
    <path
      d="M10.398 18.8h3.204V20h-2c-.665 0-1.204-.54-1.204-1.2Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#i)',
      }}
    />
    <path
      d="M5.2 13.602c-.66 0-1.2-.54-1.2-1.204v-2h1.2Zm0 0"
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: 'url(#j)',
      }}
    />
  </svg>
);
