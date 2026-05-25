import { widgetEvents as walletMgmtEvents } from '@lifi/wallet-management'
import { WidgetEvent, type WidgetEvents, widgetEvents } from '@lifi/widget'
import { GuestBridge } from '@lifi/widget-light'
import { useEffect } from 'react'

/**
 * Guest-side (iframe) bridge that forwards widget events to the host.
 *
 * Listens for WIDGET_EVENT_SUBSCRIBE/UNSUBSCRIBE messages from the host
 * and only forwards events that the host has subscribed to.
 *
 * Renders nothing — mount once, high in the tree.
 */
export function WidgetEventsBridge() {
  useEffect(() => {
    const bridge = GuestBridge.getInstance()
    let listenersAttached = false

    const widgetEventNames = Object.values(WidgetEvent) as Array<
      keyof WidgetEvents
    >
    const widgetHandlers = new Map<
      keyof WidgetEvents,
      (data: unknown) => void
    >()
    widgetEventNames.forEach((name) => {
      widgetHandlers.set(name, (data) => {
        if (bridge.getSubscribedEvents().has(name)) {
          bridge.sendWidgetEvent(name, data)
        }
      })
    })

    const walletConnectedHandler = (data: unknown) => {
      if (bridge.getSubscribedEvents().has('walletConnected')) {
        bridge.sendWidgetEvent('walletConnected', data)
      }
    }
    const walletDisconnectedHandler = (data: unknown) => {
      if (bridge.getSubscribedEvents().has('walletDisconnected')) {
        bridge.sendWidgetEvent('walletDisconnected', data)
      }
    }

    const attach = () => {
      if (listenersAttached) {
        return
      }
      listenersAttached = true
      widgetHandlers.forEach((handler, name) => {
        widgetEvents.on(name, handler as never)
      })
      walletMgmtEvents.on('walletConnected', walletConnectedHandler)
      walletMgmtEvents.on('walletDisconnected', walletDisconnectedHandler)
    }

    const detach = () => {
      if (!listenersAttached) {
        return
      }
      listenersAttached = false
      widgetHandlers.forEach((handler, name) => {
        widgetEvents.off(name, handler as never)
      })
      walletMgmtEvents.off('walletConnected', walletConnectedHandler)
      walletMgmtEvents.off('walletDisconnected', walletDisconnectedHandler)
    }

    if (bridge.getSubscribedEvents().size > 0) {
      attach()
    }

    const unsubBridge = bridge.onWidgetEventSubscriptionChange(
      (_event, isSubscribed) => {
        if (isSubscribed) {
          attach()
        } else if (bridge.getSubscribedEvents().size === 0) {
          detach()
        }
      }
    )

    return () => {
      unsubBridge()
      detach()
    }
  }, [])

  return null
}
