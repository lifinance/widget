declare module 'react-router' {
  // Your AppLoadContext used in v2
  interface AppLoadContext {
    whatever: string
  }
}

export {} // necessary for TS to treat this as a module
