'use client'
import { Box } from '@mui/material'
import { Outlet } from '@tanstack/react-router'
import {
  AppContainer,
  AppExpandedContainer,
} from './components/AppContainer.js'
import { Expansion } from './components/Expansion/Expansion.js'
import { Header } from './components/Header/Header.js'
import { Initializer } from './components/Initializer.js'
import { PageEntered } from './components/PageEntered.js'
import { ViewTierRail } from './components/ViewTierRail/ViewTierRail.js'
import { version } from './config/version.js'
import { useWideVariant } from './hooks/useWideVariant.js'
import { useWidgetConfig } from './providers/WidgetProvider/WidgetProvider.js'
import { URLSearchParamsBuilder } from './stores/form/URLSearchParamsBuilder.js'
import { createElementId, ElementId } from './utils/elements.js'

export const AppLayout: React.FC = () => {
  const { elementId, buildUrl, variant } = useWidgetConfig()
  const wideVariant = useWideVariant()

  return (
    <AppExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
      data-version={version}
    >
      {variant === 'jumper' && (
        <Box sx={{ marginRight: 2 }}>
          <ViewTierRail />
        </Box>
      )}
      <AppContainer>
        <Header />
        <Initializer />
        {buildUrl ? <URLSearchParamsBuilder /> : null}
        <PageEntered />
        <Outlet />
      </AppContainer>
      {wideVariant && <Expansion />}
    </AppExpandedContainer>
  )
}
