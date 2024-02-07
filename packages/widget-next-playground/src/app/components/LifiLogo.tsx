import type { FC, SVGProps } from 'react';
import { styled } from '@mui/material';

const LifiLogoBase: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="73" height="34" {...props}>
      <title>Li.fi</title>
      <path d="m5.66 11.343 11.314 11.314 4.243-4.243 5.694 5.694-8.486 8.485c-.707.707-2.158.67-2.865-.037L1.418 18.414c-.707-.707-.707-2.121 0-2.828l4.243-4.243ZM15.56 1.444l-4.237 4.248 17.002 17.002 4.243-4.243c.707-.707.67-2.158-.037-2.865L18.389 1.444c-.707-.707-2.122-.707-2.829 0ZM44.006 10.984v9h4.5v3h-7.5v-12h3ZM62.023 22.997V19.25h3.734v-3h-3.734v-2.253h4.5v-3h-7.5v12h3ZM50.023 10.984v12h3v-12h-3ZM68.023 10.999v12h3v-12h-3ZM54.523 19.993v3h3v-3h-3Z" />
    </svg>
  );
};

export const LifiLogo = styled(LifiLogoBase)(({ theme }) => ({
  fill:
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white,
}));
