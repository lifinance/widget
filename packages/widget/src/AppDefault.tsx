'use client'
import { AppRoutes } from './AppRoutes.js'
import {
  AppContainer,
  AppExpandedContainer,
  AppWithExpansionContainer,
  FlexContainer,
} from './components/AppContainer.js'
import { Expansion } from './components/Expansion/Expansion.js'
import { Header } from './components/Header/Header.js'
import { Initializer } from './components/Initializer.js'
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
      <AppWithExpansionContainer>
        <AppContainer>
          <Header />
          <FlexContainer disableGutters>
            <AppRoutes />
          </FlexContainer>
          <Initializer />
        </AppContainer>
        {wideVariant && <Expansion />}
      </AppWithExpansionContainer>
    </AppExpandedContainer>
  )
}
