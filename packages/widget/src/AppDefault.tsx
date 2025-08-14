'use client'
import { AppRoutes } from './AppRoutes.js'
import {
  AppContainer,
  AppExpandedContainer,
  FlexContainer,
} from './components/AppContainer.js'
import { Expansion } from './components/Expansion/Expansion.js'
import { Header } from './components/Header/Header.js'
import { Initializer } from './components/Initializer.js'
import { version } from './config/version.js'
import { useWideVariant } from './hooks/useWideVariant.js'
import { useWidgetConfig } from './providers/WidgetProvider/WidgetProvider.js'
import { createElementId, ElementId } from './utils/elements.js'

export const AppDefault = () => {
  const { elementId } = useWidgetConfig()
  const wideVariant = useWideVariant()

  return (
    <AppExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
      data-version={version}
    >
      <AppContainer>
        <Header />
        <FlexContainer disableGutters>
          <AppRoutes />
        </FlexContainer>
        <Initializer />
      </AppContainer>
      {wideVariant && <Expansion />}
    </AppExpandedContainer>
  )
}
