'use client';
import { AppRoutes } from './AppRoutes.js';
import {
  AppContainer,
  AppExpandedContainer,
  FlexContainer,
} from './components/AppContainer.js';
import { Header } from './components/Header/Header.js';
import { Initializer } from './components/Initializer.js';
import { RoutesExpanded } from './components/Routes/RoutesExpanded.js';
import { useExpandableVariant } from './hooks/useExpandableVariant.js';
import { useWidgetConfig } from './providers/WidgetProvider/WidgetProvider.js';
import { ElementId, createElementId } from './utils/elements.js';

export const AppDefault = () => {
  const { elementId } = useWidgetConfig();
  const expandable = useExpandableVariant();

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
      {expandable ? <RoutesExpanded /> : null}
    </AppExpandedContainer>
  );
};
