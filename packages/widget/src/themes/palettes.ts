export const palette = {
  primary: {
    main: '#5C67FF',
    light: '#e4e6ff',
    dark: '#4952cc',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#F5B5FF',
    light: '#fdf3ff',
    dark: '#c490cc',
    contrastText: '#201621',
  },
  success: {
    main: '#0AA65B',
    light: '#3bb77b',
    dark: '#07743f',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#FFCC00',
    light: '#ffd633',
    dark: '#b28e00',
    contrastText: '#211902',
  },
  error: {
    main: '#E5452F',
    light: '#ea6a58',
    dark: '#a03020',
    contrastText: '#ffffff',
  },
  info: {
    main: '#297EFF',
    light: '#5397ff',
    dark: '#1c58b2',
    contrastText: '#fff',
  },
  common: {
    black: '#000',
    white: '#fff',
  },
  grey: {
    '200': '#eeeeee',
    '300': '#e0e0e0',
    '700': '#616161',
    '800': '#424242',
  },
};

export const paletteDark = {
  background: {
    paper: '#212121',
    default: '#121212',
  },
  text: {
    primary: '#ffffff',
    secondary: '#bbbbbb',
    disabled: '#8f8f8f',
    icon: '#8f8f8f',
  },
  // TODO: discuss what to do with these values
  //  they are not used in widget we would need to think about how we
  //  would want to convert them. These are the dark defaults from MUI
  // divider: 'rgba(255, 255, 255, 0.12)', // dark
  // action: {
  //   active: '#fff', // dark
  //   hover: 'rgba(255, 255, 255, 0.08)', // dark
  //   selected: 'rgba(255, 255, 255, 0.16)', // dark
  //   disabled: 'rgba(255, 255, 255, 0.3)', // dark
  //   disabledBackground: 'rgba(255, 255, 255, 0.12)', // dark
  //   focus: 'rgba(255, 255, 255, 0.12)', // dark
  // },
};

export const paletteLight = {
  background: {
    paper: '#ffffff',
    default: '#ffffff',
  },
  text: {
    primary: '#000000',
    secondary: '#747474',
    disabled: '#9E9E9E',
  },

  // TODO: discuss what to do with these values
  //  they are not used in widget we would need to think about how we
  //  would want to convert them. These are the light defaults from MUI
  // divider: 'rgba(0, 0, 0, 0.12)', // light
  // action: {
  //   active: 'rgba(0, 0, 0, 0.54)', // light
  //   hover: 'rgba(0, 0, 0, 0.04)', // light
  //   selected: 'rgba(0, 0, 0, 0.08)', // light
  //   disabled: 'rgba(0, 0, 0, 0.26)', // light
  //   disabledBackground: 'rgba(0, 0, 0, 0.12)', // light
  //   focus: 'rgba(0, 0, 0, 0.12)', // light
  // },
};
