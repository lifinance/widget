export type ObjectWithFunctions = { [key: string]: any };

export type FunctionReference = {
  path: (string | number)[];
  funcRef: () => void;
};

export type Collection = Record<string | number, any>;
