import { Font } from '@/app/hooks';

export const defaultFont: Font = {
  fontName: 'Inter',
  fontSource: 'Google fonts',
  fontDefinition: [
    {
      family: 'Inter',
      url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
      options: {
        weight: '400',
        style: 'normal',
      },
    },
    {
      family: 'Inter',
      url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2',
      options: {
        weight: '500',
        style: 'normal',
      },
    },
    {
      family: 'Inter',
      url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',
      options: {
        weight: '600',
        style: 'normal',
      },
    },
    {
      family: 'Inter',
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
    fontName: 'Arial',
    fontSource: 'System fonts',
  },
  {
    fontName: 'Verdana',
    fontSource: 'System fonts',
  },
  {
    fontName: 'Tahoma',
    fontSource: 'System fonts',
  },
  {
    fontName: 'Trebuchet MS',
    fontSource: 'System fonts',
  },
  {
    fontName: 'Times New Roman',
    fontSource: 'System fonts',
  },
  {
    fontName: 'Georgia',
    fontSource: 'System fonts',
  },
  {
    fontName: 'Garamond',
    fontSource: 'System fonts',
  },
  {
    fontName: 'Courier New',
    fontSource: 'System fonts',
  },
  {
    fontName: 'Brush Script MT',
    fontSource: 'System fonts',
  },
];

// NOTE: could expore if you can use the Google fonts developer API to write a
//  script to auto generate this for more fonts
export const googleFonts: Font[] = [
  {
    fontName: 'Open Sans',
    fontSource: 'Google fonts',
    fontDefinition: [
      {
        family: 'Open Sans',
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVIUwaEQbjA.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        family: 'Open Sans',
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjr0B4gaVIUwaEQbjA.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        family: 'Open Sans',
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsgH1x4gaVIUwaEQbjA.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        family: 'Open Sans',
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
