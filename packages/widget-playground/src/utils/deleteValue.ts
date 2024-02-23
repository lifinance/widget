import type { ArrayType, Indexable, ObjectType } from '../types';

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

/**
 * This util provides a clean deep delete. It will present a cleaned tree in the original object.
 * This will help to keep the config clean for display in the code section of the playground.
 * Current supports object and array syntax
 * @param object The object you want to remove the value from
 * @param path The location within that object as an array, e.g. ['theme', 'palette', 'primary', 'main']
 */
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
      if (pathSection !== undefined) {
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
