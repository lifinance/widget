/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  // oxlint-disable-next-line typescript/no-empty-object-type -- allowed in vue
  const component: DefineComponent<{}, {}, any>
  export default component
}
