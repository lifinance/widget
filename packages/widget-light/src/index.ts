export type { UseWidgetLightHostOptions } from './host/useWidgetLightHost.js'
export { useWidgetLightHost } from './host/useWidgetLightHost.js'
export type { WidgetLightProps as WidgetLightIframeProps } from './host/WidgetLight.js'
export { WidgetLight as LiFiWidgetLight } from './host/WidgetLight.js'
export type {
  EcosystemInitState,
  GuestMessage,
  GuestReadyMessage,
  GuestResizeMessage,
  GuestRpcRequest,
  HostEventMessage,
  HostInitMessage,
  HostMessage,
  HostRpcResponse,
  IframeEcosystemHandler,
  RpcError,
  WidgetLightChainType,
  WidgetLightConfig,
} from './shared/protocol.js'
export {
  isGuestMessage,
  isWidgetLightMessage,
  WIDGET_LIGHT_SOURCE,
} from './shared/protocol.js'
