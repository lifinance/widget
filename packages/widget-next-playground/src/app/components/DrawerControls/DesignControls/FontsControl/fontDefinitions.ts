import { Font } from '../../../../hooks';

export const defaultFont: Font = {
  family: 'Inter',
  source: 'Google fonts',
  fontFiles: [
    {
      url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
      options: {
        weight: '400',
        style: 'normal',
      },
    },
    {
      url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2',
      options: {
        weight: '500',
        style: 'normal',
      },
    },
    {
      url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',
      options: {
        weight: '600',
        style: 'normal',
      },
    },
    {
      url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2',
      options: {
        weight: '700',
        style: 'normal',
      },
    },
  ],
};

export const systemFonts: Font[] = [
  {
    family: 'Arial',
    fallbackFonts: 'sans-serif',
    source: 'System fonts',
  },
  {
    family: 'Verdana',
    fallbackFonts: 'sans-serif',
    source: 'System fonts',
  },
  {
    family: 'Tahoma',
    fallbackFonts: 'sans-serif',
    source: 'System fonts',
  },
  {
    family: 'Trebuchet MS',
    fallbackFonts: 'sans-serif',
    source: 'System fonts',
  },
  {
    family: 'Times New Roman',
    fallbackFonts: 'serif',
    source: 'System fonts',
  },
  {
    family: 'Georgia',
    fallbackFonts: 'serif',
    source: 'System fonts',
  },
  {
    family: 'Garamond',
    fallbackFonts: 'serif',
    source: 'System fonts',
  },
  {
    family: 'Courier New',
    fallbackFonts: 'Courier, monospace',
    source: 'System fonts',
  },
  {
    family: 'Brush Script MT',
    fallbackFonts: 'cursive',
    source: 'System fonts',
  },
];

// NOTE: could explore if you can use the Google fonts developer API to write a
//  script to auto generate this for more fonts
export const googleFonts: Font[] = [
  {
    family: 'Open Sans',
    source: 'Google fonts',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVIUwaEQbjA.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjr0B4gaVIUwaEQbjA.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsgH1x4gaVIUwaEQbjA.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVIUwaEQbjA.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
];

export const allFonts: Font[] = [
  { ...defaultFont },
  ...systemFonts,
  ...googleFonts,
];
