import type { Font } from '../../../../providers/FontLoaderProvider/types'

// NOTE: We could explore using the Google fonts developer API to write a
//  script to auto generate more fonts we could even consider a light Next API endpoint to serve a list
//  of the 1500+ fonts that are on Google.
//  In the app we currently have a list of the 10 most popular fonts from Google that carry all the weights

//  that widget needs
export const googleFonts: Font[] = [
  {
    family: 'Open Sans',
    source: 'Google fonts',
    fallbackFonts: 'sans-serif',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4iY1M2xLER.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjr0C4iY1M2xLER.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsgH1y4iY1M2xLER.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4iY1M2xLER.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
  {
    family: 'Noto Sans JP',
    source: 'Google fonts',
    fallbackFonts: 'sans-serif',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj757Y0rw-oME.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFCMj757Y0rw-oME.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFM8k757Y0rw-oME.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk757Y0rw-oME.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
  {
    family: 'Montserrat',
    source: 'Google fonts',
    fallbackFonts: 'sans-serif',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew7Y3tcoqK5.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew7Y3tcoqK5.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu170w7Y3tcoqK5.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w7Y3tcoqK5.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
  {
    family: 'Poppins',
    source: 'Google fonts',
    fallbackFonts: 'sans-serif',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJXUc1NECPY.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9V15vFP-KUEg.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6V15vFP-KUEg.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V15vFP-KUEg.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
  {
    family: 'Roboto Condensed',
    source: 'Google fonts',
    fallbackFonts: 'sans-serif',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/robotocondensed/v27/ieVo2ZhZI2eCN5jzbjEETS9weq8-_d6T_POl0fRJeyWyovBM731BKMSK.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/robotocondensed/v27/ieVo2ZhZI2eCN5jzbjEETS9weq8-_d6T_POl0fRJeyWAovBM731BKMSK.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/robotocondensed/v27/ieVo2ZhZI2eCN5jzbjEETS9weq8-_d6T_POl0fRJeyVspfBM731BKMSK.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/robotocondensed/v27/ieVo2ZhZI2eCN5jzbjEETS9weq8-_d6T_POl0fRJeyVVpfBM731BKMSK.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
  {
    family: 'Roboto Mono',
    source: 'Google fonts',
    fallbackFonts: 'monospace',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vqPRu-5Ip2sSQ.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_7PqPRu-5Ip2sSQ.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_AP2PRu-5Ip2sSQ.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/robotomono/v23/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_Of2PRu-5Ip2sSQ.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
  {
    family: 'Oswald',
    source: 'Google fonts',
    fallbackFonts: 'sans-serif',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvgURoZAaRliE.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs18NvgURoZAaRliE.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1y9ogURoZAaRliE.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/oswald/v53/TK3_WkUHHAIjg75cFRf3bXL8LICs1xZogURoZAaRliE.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
  {
    family: 'Noto Sans',
    source: 'Google fonts',
    fallbackFonts: 'sans-serif',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/notosans/v35/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99Y41P6zHtY.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/notosans/v35/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyDPA99Y41P6zHtY.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/notosans/v35/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAjBN9Y41P6zHtY.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/notosans/v35/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAaBN9Y41P6zHtY.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
  {
    family: 'Raleway',
    source: 'Google fonts',
    fallbackFonts: 'sans-serif',
    fontFiles: [
      {
        url: 'https://fonts.gstatic.com/s/raleway/v29/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaooCKNLA3JC9c.woff2',
        options: {
          weight: '400',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/raleway/v29/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvoooCKNLA3JC9c.woff2',
        options: {
          weight: '500',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/raleway/v29/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVsEpYCKNLA3JC9c.woff2',
        options: {
          weight: '600',
          style: 'normal',
        },
      },
      {
        url: 'https://fonts.gstatic.com/s/raleway/v29/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pYCKNLA3JC9c.woff2',
        options: {
          weight: '700',
          style: 'normal',
        },
      },
    ],
  },
]
