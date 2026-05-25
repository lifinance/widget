import EventEmitter from 'eventemitter3'
import type { WidgetEvents } from '../types/events.js'

export type WidgetEventEmitter = EventEmitter<WidgetEvents>

export const widgetEvents: WidgetEventEmitter = new EventEmitter<WidgetEvents>()

export const useWidgetEvents = (): WidgetEventEmitter => widgetEvents
