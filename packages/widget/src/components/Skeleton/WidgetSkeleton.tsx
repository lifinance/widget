import { Skeleton, ThemeProvider, useMediaQuery } from '@mui/material'
import { useMemo } from 'react'
import { createTheme } from '../../themes/createTheme.js'
import type { WidgetConfigPartialProps } from '../../types/widget.js'
import {
  AppExpandedContainer,
  FlexContainer,
  RelativeContainer,
} from '../AppContainer.js'
import {
  SkeletonAmountContainer,
  SkeletonCard,
  SkeletonCardRow,
  SkeletonHeaderAppBar,
  SkeletonHeaderContainer,
  SkeletonInputCard,
  SkeletonPoweredByContainer,
  SkeletonReviewButton,
  SkeletonReviewButtonContainer,
  SkeletonSendToWalletButton,
  SkeletonWalletMenuButtonContainer,
} from './WidgetSkeleton.style.js'

const SkeletonIcon = () => <Skeleton width={24} height={24} variant="rounded" />
const SkeletonWalletMenuButton = () => (
  <SkeletonWalletMenuButtonContainer>
    <Skeleton width={98} height={19} variant="text" />
    <SkeletonIcon />
  </SkeletonWalletMenuButtonContainer>
)

interface SkeletonSelectCardProps {
  titleWidth?: number
  placeholderWidth?: number
}
const SkeletonSelectCard = ({
  titleWidth = 36,
  placeholderWidth = 195,
}: SkeletonSelectCardProps) => (
  <SkeletonCard elevation={0}>
    <Skeleton width={titleWidth} height={22} variant="text" />
    <SkeletonCardRow>
      <Skeleton width={40} height={40} variant="circular" />
      <Skeleton width={placeholderWidth} height={27} variant="text" />
    </SkeletonCardRow>
  </SkeletonCard>
)

const SkeletonYouPayCard = () => (
  <SkeletonInputCard elevation={0}>
    <Skeleton width={55} height={22} variant="text" />
    <SkeletonCardRow>
      <Skeleton width={40} height={40} variant="circular" />
      <SkeletonAmountContainer>
        <Skeleton
          width={48}
          height={37}
          variant="text"
          sx={{ marginTop: -0.75 }}
        />
        <Skeleton width={48} height={12} variant="text" />
      </SkeletonAmountContainer>
    </SkeletonCardRow>
  </SkeletonInputCard>
)

export const WidgetSkeleton = ({ config }: WidgetConfigPartialProps) => {
  const appearance = config?.appearance
  const hiddenUI = config?.hiddenUI || []
  const requiredUI = config?.requiredUI || []
  const configTheme = config?.theme
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const appearanceMode =
    !appearance || appearance === 'system'
      ? prefersDarkMode
        ? 'dark'
        : 'light'
      : appearance

  const theme = useMemo(() => createTheme(configTheme), [configTheme])

  return (
    <ThemeProvider
      theme={theme}
      defaultMode={appearanceMode}
      modeStorageKey="li.fi-widget-mode"
      colorSchemeStorageKey="li.fi-widget-color-scheme"
      disableTransitionOnChange
    >
      {/* isLongPage is true to restrict max height of the skeleton */}
      <AppExpandedContainer isLongPage>
        <RelativeContainer
          sx={{ display: 'flex', flexDirection: 'column' }}
          isLongPage
        >
          <SkeletonHeaderContainer>
            {!hiddenUI.includes('walletMenu') ? (
              <SkeletonHeaderAppBar>
                <SkeletonWalletMenuButton />
              </SkeletonHeaderAppBar>
            ) : null}
            <SkeletonHeaderAppBar
              sx={{ justifyContent: 'space-between', height: 40 }}
            >
              <Skeleton width={126} height={34} variant="text" />
              <SkeletonIcon />
            </SkeletonHeaderAppBar>
          </SkeletonHeaderContainer>

          <FlexContainer
            sx={{
              gap: 2,
              paddingBottom: hiddenUI.includes('poweredBy') ? 3 : 2,
            }}
          >
            <SkeletonSelectCard />
            <SkeletonSelectCard />
            <SkeletonYouPayCard />
            {requiredUI.includes('toAddress') ? (
              <SkeletonSelectCard titleWidth={104} placeholderWidth={175} />
            ) : null}
            <SkeletonReviewButtonContainer>
              <SkeletonReviewButton variant="contained" fullWidth>
                &nbsp;
              </SkeletonReviewButton>
              {!requiredUI.includes('toAddress') ? (
                <SkeletonSendToWalletButton variant="text" fullWidth>
                  &nbsp;
                </SkeletonSendToWalletButton>
              ) : null}
            </SkeletonReviewButtonContainer>
          </FlexContainer>
          {!hiddenUI.includes('poweredBy') ? (
            <SkeletonPoweredByContainer>
              <Skeleton width={96} height={18} variant="text" />
            </SkeletonPoweredByContainer>
          ) : null}
        </RelativeContainer>
      </AppExpandedContainer>
    </ThemeProvider>
  )
}
