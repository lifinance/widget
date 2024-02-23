import type { Difference } from 'microdiff';

type Indexable = Record<string | number, any>;
type ObjectType = Record<string, any>;
type ArrayType = Array<any>;

const deleteNode = (
  node: ObjectType | ArrayType,
  pathSection: string | number,
) => {
  if (Array.isArray(node)) {
    node.splice(pathSection as number, 1);
  } else {
    delete node[pathSection];
  }
};

export const deleteValue = <T>(object: T, path: Array<string | number>) => {
  const nodes = path.reduce(
    (accum, pathSection, i, arr) => {
      if (i !== arr.length - 1) {
        const lastNode = accum[accum.length - 1] as ObjectType | ArrayType;
        accum.push((lastNode as Indexable)[pathSection]);
      }
      return accum;
    },
    [object],
  );

  nodes.reduceRight<(string | number)[]>(
    (accum, node, i, arr) => {
      const pathSection = accum.pop();

      if (pathSection) {
        if (i === arr.length - 1) {
          deleteNode(node as ObjectType | ArrayType, pathSection);
        } else {
          if (Array.isArray((node as Indexable)[pathSection])) {
            const hasChildren = !!(node as Indexable)[pathSection].length;
            if (!hasChildren) {
              deleteNode(node as ArrayType, pathSection);
            }
          } else {
            const hasChildren = !!Object.keys((node as Indexable)[pathSection])
              .length;
            if (!hasChildren) {
              deleteNode(node as ObjectType, pathSection);
            }
          }
        }
      }

      return accum;
    },
    [...path],
  );

  return object;
};

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

export const applyDifferencesToObject = <T>(
  object: T,
  differences: Difference[],
) => {
  return differences.reduce(
    (accum, difference) => {
      if (difference.type === 'CREATE' || difference.type === 'CHANGE') {
        return addValue<T>(accum, difference.path, difference.value);
      }
      if (difference.type === 'REMOVE') {
        return deleteValue<T>(accum, difference.path);
      }
      return accum;
    },
    { ...object },
  );
};
