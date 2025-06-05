'use client'
import { AppRoutes } from './AppRoutes.js'
import {
  AppContainer,
  AppExpandedContainer,
  FlexContainer,
} from './components/AppContainer.js'
import { SelectChainEmbedded } from './components/Chains/SelectChainEmbedded.js'
import { Header } from './components/Header/Header.js'
import { Initializer } from './components/Initializer.js'
import { RoutesExpanded } from './components/Routes/RoutesExpanded.js'
import { useWideVariant } from './hooks/useWideVariant.js'
import { useWidgetConfig } from './providers/WidgetProvider/WidgetProvider.js'
import { ElementId, createElementId } from './utils/elements.js'

export const AppDefault = () => {
  const { elementId } = useWidgetConfig()
  const wideVariant = useWideVariant()

  return (
    <AppExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
    >
      <AppContainer>
        <Header />
        <FlexContainer disableGutters>
          <AppRoutes />
        </FlexContainer>
        <Initializer />
      </AppContainer>
      {wideVariant && <SelectChainEmbedded />}
      {wideVariant && <RoutesExpanded />}
    </AppExpandedContainer>
  )
}
