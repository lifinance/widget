import { Container, styled } from '@mui/material';

export interface PageContainerProps {
  halfGutters?: boolean;
  topGutters?: boolean;
  bottomGutters?: boolean;
}

export const PageContainer = styled(Container, {
  shouldForwardProp: (prop) =>
    !['halfGutters', 'topGutters', 'bottomGutters'].includes(prop as string),
})<PageContainerProps>(
  ({ theme, disableGutters, halfGutters, topGutters, bottomGutters }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: disableGutters
      ? 0
      : theme.spacing(
          topGutters ? 1 : 0,
          halfGutters ? 1.5 : 3,
          bottomGutters ? 3 : 0,
          halfGutters ? 1.5 : 3,
        ),
  }),
);
