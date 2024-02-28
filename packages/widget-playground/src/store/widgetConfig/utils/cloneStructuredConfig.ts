import type { WidgetConfig } from '@lifi/widget';

export type ObjectType = Record<string, any>;

const supportedShallowReferences = ['walletConfig'];

const shallowReferences = () => {
  const referencesDictionary: ObjectType = {};
  const substituteShallowReferences = (
    config: Partial<WidgetConfig>,
  ): Partial<WidgetConfig> => {
    supportedShallowReferences.forEach((nonClonable) => {
      if ((config as ObjectType)[nonClonable]) {
        referencesDictionary[nonClonable] = (config as ObjectType)[nonClonable];
        (config as ObjectType)[nonClonable] = {};
      }
    });
    return config;
  };

  const rehydrateShallowReferences = (
    config: Partial<WidgetConfig>,
  ): Partial<WidgetConfig> => {
    Object.entries(referencesDictionary).forEach(
      ([nonClonableKey, nonClonableValue]) => {
        (config as ObjectType)[nonClonableKey] = nonClonableValue;
      },
    );

    return config;
  };
  return {
    substituteShallowReferences,
    rehydrateShallowReferences,
  };
};

/**
 * Some parts of the config use functions which can't easily be cloned, converted to JSON or output to
 * localstorage. This function should help to temporary substitute those values when we clone and restore
 * those values afterwards.
 * This only currently supports the basic case of walletConfig = { async onConnect() {} }
 * We might want to flesh this out more in future for other values.
 * NOTE: any shallow references like walletConfig are not treated as deep copies - the reference in the configs is different
 * but the object of that reference with be share between the original and the cloned config.
 *
 * @param original The config object that you want to clone
 */
export const cloneStructuredConfig = (original: Partial<WidgetConfig>) => {
  const { substituteShallowReferences, rehydrateShallowReferences } =
    shallowReferences();

  const clone = rehydrateShallowReferences(
    structuredClone(substituteShallowReferences(original)),
  );

  // we need restore the original as well
  rehydrateShallowReferences(original);

  return clone;
};
