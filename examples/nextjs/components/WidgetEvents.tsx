'use client'
import type { Route } from '@lifi/sdk'
import type {
  RouteExecutionUpdate,
  RouteHighValueLossUpdate,
} from '@lifi/widget'
import { useWidgetEvents, WidgetEvent } from '@lifi/widget'
import { useEffect } from 'react'

export const WidgetEvents = () => {
  const widgetEvents = useWidgetEvents()

  useEffect(() => {
    const onRouteExecutionStarted = (_route: Route) => {
      console.log('onRouteExecutionStarted fired.')
    }
    const onRouteExecutionUpdated = (_update: RouteExecutionUpdate) => {
      console.log('onRouteExecutionUpdated fired.')
    }
    const onRouteExecutionCompleted = (_route: Route) => {
      console.log('onRouteExecutionCompleted fired.')
    }
    const onRouteExecutionFailed = (_update: RouteExecutionUpdate) => {
      console.log('onRouteExecutionFailed fired.')
    }
    const onRouteHighValueLoss = (_update: RouteHighValueLossUpdate) => {
      console.log('onRouteHighValueLoss continued.')
    }
    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted)
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated)
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted
    )
    widgetEvents.on(WidgetEvent.RouteHighValueLoss, onRouteHighValueLoss)
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed)
    return () => widgetEvents.all.clear()
  }, [widgetEvents])

  return null
}
