'use client'
import { Outlet } from '@tanstack/react-router'
import {
  AppContainer,
  AppExpandedContainer,
} from './components/AppContainer.js'
import { Expansion } from './components/Expansion/Expansion.js'
import { Header } from './components/Header/Header.js'
import { Initializer } from './components/Initializer.js'
import { PageEntered } from './components/PageEntered.js'
import { version } from './config/version.js'
import { useWideVariant } from './hooks/useWideVariant.js'
import { useWidgetConfig } from './providers/WidgetProvider/WidgetProvider.js'
import { URLSearchParamsBuilder } from './stores/form/URLSearchParamsBuilder.js'
import { createElementId, ElementId } from './utils/elements.js'

export const AppLayout: React.FC = () => {
  const { elementId, buildUrl } = useWidgetConfig()
  const wideVariant = useWideVariant()

  return (
    <AppExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
      data-version={version}
    >
      <AppContainer>
        <Header />
        <Initializer />
        <Outlet />
        {buildUrl ? <URLSearchParamsBuilder /> : null}
        <PageEntered />
      </AppContainer>
      {wideVariant && <Expansion />}
    </AppExpandedContainer>
  )
}
