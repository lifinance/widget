'use client'
import { Outlet } from '@tanstack/react-router'
import { AppContainer, AppExpandedContainer } from './components/AppContainer'
import { Expansion } from './components/Expansion/Expansion'
import { Header } from './components/Header/Header'
import { Initializer } from './components/Initializer'
import { PageEntered } from './components/PageEntered'
import { version } from './config/version'
import { useWideVariant } from './hooks/useWideVariant'
import { useWidgetConfig } from './providers/WidgetProvider/WidgetProvider'
import { URLSearchParamsBuilder } from './stores/form/URLSearchParamsBuilder'
import { createElementId, ElementId } from './utils/elements'

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
        {buildUrl ? <URLSearchParamsBuilder /> : null}
        <PageEntered />
        <Outlet />
      </AppContainer>
      {wideVariant && <Expansion />}
    </AppExpandedContainer>
  )
}
