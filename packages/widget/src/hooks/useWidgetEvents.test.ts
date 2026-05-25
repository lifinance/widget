import { describe, expect, it, vi } from 'vitest'
import { WidgetEvent } from '../types/events.js'
import { widgetEvents } from './useWidgetEvents.js'

describe('widgetEvents', () => {
  it('every WidgetEvent value can be emitted and received', () => {
    for (const name of Object.values(WidgetEvent)) {
      const spy = vi.fn()
      widgetEvents.on(name, spy as never)
      widgetEvents.emit(name, undefined as never)
      expect(spy).toHaveBeenCalledOnce()
      widgetEvents.off(name, spy as never)
    }
  })

  it('listenerCount reflects added and removed listeners', () => {
    const handler = vi.fn()
    expect(widgetEvents.listenerCount(WidgetEvent.ContactSupport)).toBe(0)
    widgetEvents.on(WidgetEvent.ContactSupport, handler)
    expect(widgetEvents.listenerCount(WidgetEvent.ContactSupport)).toBe(1)
    widgetEvents.off(WidgetEvent.ContactSupport, handler)
    expect(widgetEvents.listenerCount(WidgetEvent.ContactSupport)).toBe(0)
  })
})
