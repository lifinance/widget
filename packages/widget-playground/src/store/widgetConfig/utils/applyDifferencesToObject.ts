import { Difference } from 'microdiff';

type ObjectType = { [key: string]: any };
type ArrayType = Array<any>;

// TODO: can this be used in the add to
const addValue = <T>(
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

// TODO: add type === "REMOVE" case to support walletConfig property
export const applyDifferencesToObject = <T>(
  object: T,
  differences: Difference[],
) => {
  return differences.reduce(
    (accum, difference) => {
      if (difference.type === 'CREATE' || difference.type === 'CHANGE') {
        return addValue<T>(accum, difference.path, difference.value);
      }
      return accum;
    },
    { ...object },
  );
};
