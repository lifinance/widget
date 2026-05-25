import {
  WalletManagementEvent,
  type WalletManagementEvents,
  widgetEvents as walletMgmtEvents,
} from '@lifi/wallet-management'
import { WidgetEvent, type WidgetEvents, widgetEvents } from '@lifi/widget'
import { GuestBridge } from '@lifi/widget-light'
import { useEffect } from 'react'

/**
 * Guest-side (iframe) bridge that forwards widget events to the host.
 *
 * Listens for WIDGET_EVENT_SUBSCRIBE/UNSUBSCRIBE messages from the host
 * and only attaches widget-side listeners for events the host has
 * subscribed to. This keeps `widgetEvents.listenerCount(name)` honest:
 * features like `useContactSupport` gate on whether anyone is listening
 * for a specific event, so the bridge must not register listeners
 * the host doesn't actually want.
 *
 * Renders nothing — mount once, high in the tree.
 */
export function WidgetEventsBridge() {
  useEffect(() => {
    const bridge = GuestBridge.getInstance()

    const widgetEventNames = new Set(Object.values(WidgetEvent)) as Set<string>
    const walletEventNames = new Set(
      Object.values(WalletManagementEvent)
    ) as Set<string>

    const widgetHandlers = new Map<
      keyof WidgetEvents,
      (data: unknown) => void
    >()
    for (const name of Object.values(WidgetEvent) as Array<
      keyof WidgetEvents
    >) {
      widgetHandlers.set(name, (data) => bridge.sendWidgetEvent(name, data))
    }

    const walletHandlers = new Map<
      keyof WalletManagementEvents,
      (data: unknown) => void
    >()
    for (const name of Object.values(WalletManagementEvent) as Array<
      keyof WalletManagementEvents
    >) {
      walletHandlers.set(name, (data) => bridge.sendWidgetEvent(name, data))
    }

    const attached = new Set<string>()

    const attachEvent = (name: string) => {
      if (attached.has(name)) {
        return
      }
      if (widgetEventNames.has(name)) {
        const key = name as keyof WidgetEvents
        widgetEvents.on(key, widgetHandlers.get(key)! as never)
        attached.add(name)
      } else if (walletEventNames.has(name)) {
        const key = name as keyof WalletManagementEvents
        walletMgmtEvents.on(key, walletHandlers.get(key)! as never)
        attached.add(name)
      }
    }

    const detachEvent = (name: string) => {
      if (!attached.has(name)) {
        return
      }
      if (widgetEventNames.has(name)) {
        const key = name as keyof WidgetEvents
        widgetEvents.off(key, widgetHandlers.get(key)! as never)
      } else if (walletEventNames.has(name)) {
        const key = name as keyof WalletManagementEvents
        walletMgmtEvents.off(key, walletHandlers.get(key)! as never)
      }
      attached.delete(name)
    }

    bridge.getSubscribedEvents().forEach(attachEvent)

    const unsubBridge = bridge.onWidgetEventSubscriptionChange(
      (event, isSubscribed) => {
        if (isSubscribed) {
          attachEvent(event)
        } else {
          detachEvent(event)
        }
      }
    )

    return () => {
      unsubBridge()
      // Snapshot — detachEvent mutates the set.
      for (const name of [...attached]) {
        detachEvent(name)
      }
    }
  }, [])

  return null
}
