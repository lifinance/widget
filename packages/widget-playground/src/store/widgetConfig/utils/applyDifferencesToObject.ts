import type { Difference } from 'microdiff';
import { addValue, deleteValue } from '../../../utils';

/**
 * This util function applies a set of changes to an object. It has been written to work with the differences array
 * as output by microdiff
 *
 * @param object That the differences will be applied too
 * @param differences The list of differences to apply. This should take the form of the output from the microdiff function
 */
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
