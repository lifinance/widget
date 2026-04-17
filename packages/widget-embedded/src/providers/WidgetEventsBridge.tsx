import { widgetEvents as walletMgmtEvents } from '@lifi/wallet-management'
import { widgetEvents } from '@lifi/widget'
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
    const noopHandler = () => {}
    let listenersAttached = false

    // Events that gate on widgetEvents.all.has() need a specific no-op
    // listener so the gate check passes (mitt wildcard doesn't register
    // under specific event keys).
    const isGatedEvent = (event: string) => event === 'contactSupport'

    const wildcardHandler = (type: string, data: unknown) => {
      if (bridge.getSubscribedEvents().has(type)) {
        bridge.sendWidgetEvent(type, data)
      }
    }

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
      widgetEvents.on('*', wildcardHandler)
      walletMgmtEvents.on('walletConnected', walletConnectedHandler)
      walletMgmtEvents.on('walletDisconnected', walletDisconnectedHandler)
    }

    const detach = () => {
      if (!listenersAttached) {
        return
      }
      listenersAttached = false
      widgetEvents.off('*', wildcardHandler)
      walletMgmtEvents.off('walletConnected', walletConnectedHandler)
      walletMgmtEvents.off('walletDisconnected', walletDisconnectedHandler)
      widgetEvents.off('contactSupport', noopHandler)
    }

    if (bridge.getSubscribedEvents().size > 0) {
      attach()
    }

    const unsubBridge = bridge.onWidgetEventSubscriptionChange(
      (event, isSubscribed) => {
        if (isSubscribed) {
          attach()
          if (isGatedEvent(event)) {
            widgetEvents.on('contactSupport', noopHandler)
          }
        } else {
          if (isGatedEvent(event)) {
            widgetEvents.off('contactSupport', noopHandler)
          }
          if (bridge.getSubscribedEvents().size === 0) {
            detach()
          }
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
