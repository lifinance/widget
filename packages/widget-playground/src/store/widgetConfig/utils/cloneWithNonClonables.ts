import type { WidgetConfig } from '@lifi/widget';

export type ObjectType = Record<string, any>;

const nonClonableList = ['walletConfig'];

const nonClonables = () => {
  const nonClonablesDictionary: ObjectType = {};
  const substituteNonClonables = (
    config: Partial<WidgetConfig>,
  ): Partial<WidgetConfig> => {
    nonClonableList.forEach((nonClonable) => {
      if ((config as ObjectType)[nonClonable]) {
        nonClonablesDictionary[nonClonable] = (config as ObjectType)[
          nonClonable
        ];
        (config as ObjectType)[nonClonable] = {};
      }
    });
    return config;
  };

  const rehydrateNonClonables = (
    config: Partial<WidgetConfig>,
  ): Partial<WidgetConfig> => {
    Object.entries(nonClonablesDictionary).forEach(
      ([nonClonableKey, nonClonableValue]) => {
        (config as ObjectType)[nonClonableKey] = nonClonableValue;
      },
    );

    return config;
  };
  return {
    substituteNonClonables,
    rehydrateNonClonables,
  };
};

/**
 * Some parts of the config use functions which can't easily be cloned, converted to JSON or output to
 * localstorage. This function should help to temporary substitute those values when we clone and restore
 * those values afterwards.
 * This only currently supports the basic case of walletConfig = { async onConnect() {} }
 * We might want to flush this out more in future for other values.
 * NOTE: any nonClonables are not treated as deep copies - the reference in the configs is different
 * but the object of that reference with be share between the original and the cloned config.
 *
 * @param original The config object that you want to clone
 */
export const cloneWithNonClonables = (original: Partial<WidgetConfig>) => {
  const { substituteNonClonables, rehydrateNonClonables } = nonClonables();

  const clone = rehydrateNonClonables(
    structuredClone(substituteNonClonables(original)),
  );

  // we need restore the original as well
  rehydrateNonClonables(original);

  return clone;
};
