import type { WidgetConfig } from '../../types/widget.js';
import {
  SkeletonCard,
  SkeletonCardRow,
  SkeletonHeaderAppBar,
  SkeletonHeaderContainer,
  SkeletonInputCard,
  SkeletonRelativeContainer,
  SkeletonReviewButton,
  SkeletonSendToWalletButton,
  SkeletonWalletMenuButtonContainer,
} from './WidgetSkeleton.style.js';
import { AppExpandedContainer, FlexContainer } from '../AppContainer.js';
import React, { useMemo } from 'react';
import { type Theme, Box, Skeleton, useMediaQuery } from '@mui/material';
import { createTheme } from '../../themes/createTheme.js';
import type { WidgetTheme } from '../../types/widget.js';

interface SkeletonComponentProps {
  skeletonTheme: Partial<WidgetTheme & Theme>;
}

const SkeletonIcon = () => (
  <Skeleton width={24} height={24} variant="rounded" />
);
const SkeletonWalletMenuButton = ({
  skeletonTheme,
}: SkeletonComponentProps) => (
  <SkeletonWalletMenuButtonContainer skeletonTheme={skeletonTheme}>
    <Skeleton width={98} height={19} variant="text" />
    <SkeletonIcon />
  </SkeletonWalletMenuButtonContainer>
);

const SkeletonSelectCard = ({ skeletonTheme }: SkeletonComponentProps) => (
  <SkeletonCard skeletonTheme={skeletonTheme} elevation={0}>
    <Skeleton width={36} height={22} variant="text" />
    <SkeletonCardRow skeletonTheme={skeletonTheme}>
      <Skeleton width={40} height={40} variant="circular" />
      <Skeleton width={195} height={27} variant="text" />
    </SkeletonCardRow>
  </SkeletonCard>
);

const SkeletonYouPayCard = ({ skeletonTheme }: SkeletonComponentProps) => (
  <SkeletonInputCard skeletonTheme={skeletonTheme} elevation={0}>
    <Skeleton width={58} height={22} variant="text" />
    <SkeletonCardRow skeletonTheme={skeletonTheme}>
      <Skeleton width={40} height={40} variant="circular" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Skeleton
          width={20}
          height={37}
          variant="text"
          sx={{ marginTop: -1.25 }}
        />
        <Skeleton
          width={37}
          height={12}
          variant="text"
          sx={{ marginTop: -0.25 }}
        />
      </Box>
    </SkeletonCardRow>
  </SkeletonInputCard>
);

interface WidgetSkeletonProps {
  config: Partial<WidgetConfig>;
}

export const WidgetSkeleton = ({ config }: WidgetSkeletonProps) => {
  const { appearance, hiddenUI, subvariant } = config;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const appearanceMode =
    !appearance || appearance === 'auto'
      ? prefersDarkMode
        ? 'dark'
        : 'light'
      : appearance;

  const theme = useMemo(
    () => createTheme(appearanceMode, config.theme),
    [appearanceMode, config.theme],
  );

  return (
    <AppExpandedContainer>
      <SkeletonRelativeContainer skeletonTheme={theme}>
        <SkeletonHeaderContainer skeletonTheme={theme}>
          {!hiddenUI?.includes('walletMenu') ? (
            <SkeletonHeaderAppBar skeletonTheme={theme}>
              <SkeletonWalletMenuButton skeletonTheme={theme} />
            </SkeletonHeaderAppBar>
          ) : null}
          <SkeletonHeaderAppBar
            skeletonTheme={theme}
            sx={{ justifyContent: 'space-between', height: 40 }}
          >
            <Skeleton
              width={subvariant === 'refuel' ? 42 : 126}
              height={34}
              variant="text"
            />
            <SkeletonIcon />
          </SkeletonHeaderAppBar>
        </SkeletonHeaderContainer>
        <FlexContainer sx={{ gap: 2 }}>
          <SkeletonSelectCard skeletonTheme={theme} />
          <SkeletonSelectCard skeletonTheme={theme} />
          <SkeletonYouPayCard skeletonTheme={theme} />
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              marginBottom: hiddenUI?.includes('poweredBy') ? 3 : 0,
            }}
          >
            <SkeletonReviewButton skeletonTheme={theme} fullWidth disabled>
              &nbsp;
            </SkeletonReviewButton>
            <SkeletonSendToWalletButton
              variant="text"
              skeletonTheme={theme}
              fullWidth
              disabled
            >
              &nbsp;
            </SkeletonSendToWalletButton>
          </Box>
          {!hiddenUI?.includes('poweredBy') ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 2,
              }}
            >
              <Skeleton width={76} height={18} variant="text" />
            </Box>
          ) : null}
        </FlexContainer>
      </SkeletonRelativeContainer>
    </AppExpandedContainer>
  );
};
