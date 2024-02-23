import type { ArrayType, ObjectType } from '../types';

/**
 * Takes an object and then sets a value on that object using the location path stated.
 * For example the path 'theme.palette.primary.main' would match to
 * {
 *   theme: {
 *     palette: {
 *       primary: {
 *         main: "YourValueHere"
 *       }
 *     }
 *   }
 * }
 * Current supports object and array syntax
 * @param object The object you want to add the value too
 * @param path The location within that object as an array, e.g. ['theme', 'palette', 'primary', 'main']
 * @param value The value to be added at that location
 */
export const addValue = <T>(
  object: T,
  path: Array<string | number>,
  value: string,
) => {
  let lastNode: T | ObjectType | ArrayType = { ...object };
  return path.reduce((accum, pathSection, i, arr) => {
    if (typeof pathSection === 'string') {
      if (i === arr.length - 1) {
        (lastNode as ObjectType)[pathSection] = value;
      } else {
        if (!(lastNode as ObjectType)[pathSection]) {
          (lastNode as ObjectType)[pathSection] = Number.isFinite(arr[i + 1])
            ? []
            : {};
        }
        lastNode = (lastNode as ObjectType)[pathSection];
      }
    } else if (Number.isFinite(pathSection)) {
      if (i === arr.length - 1) {
        if ((lastNode as ArrayType)[pathSection] !== value) {
          (lastNode as ArrayType)[pathSection] = value;
        }
      } else {
        if (!(lastNode as ArrayType)[pathSection]) {
          const collection = Number.isFinite(arr[i + 1]) ? [] : {};
          (lastNode as ArrayType).push(collection);
          lastNode = collection;
        } else {
          lastNode = (lastNode as ArrayType)[pathSection];
        }
      }
    }

    return accum;
  }, lastNode);
};

/**
 * Takes an object and then sets a value on that object using the location path stated.
 * For example the path 'theme.palette.primary.main' would match to
 * {
 *   theme: {
 *     palette: {
 *       primary: {
 *         main: "YourValueHere"
 *       }
 *     }
 *   }
 * }
 * Current only supports object syntax, not arrays
 * @param object The object you want to add the value too
 * @param path The location within that object as a string, e.g. 'theme.palette.primary.main'
 * @param value The value to be added at that location
 */
export const addValueFromPathString = <ReturnType>(
  object: ReturnType | undefined,
  path: string,
  value: string,
) => {
  if (!object) {
    return undefined;
  }
  const pathArr = path.split('.');

  return addValue<ReturnType>(object, pathArr, value);
};
