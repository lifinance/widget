export type ObjectWithFunctions = { [key: string]: any }

export type FunctionReference = {
  path: (string | number)[]
  funcRef: () => void
  substituteId?: string
}

export type Collection = Record<string | number, any>
