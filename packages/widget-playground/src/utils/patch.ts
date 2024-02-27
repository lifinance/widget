type Indexable = Record<string | number, any>;

/**
 * This patch function is written by the creator of microdiff and can be found in the micropatch repo. It can be used to
 * apply changes to an object using the differences output from microdiff
 * https://github.com/AsyncBanana/micropatch
 * Thought the readme file states it can be installed with npm its actually not currently available from the npm registry
 * I've made some minor changes just to get it to play nice with our type system and our linting
 * - see https://github.com/AsyncBanana/micropatch/issues/3
 */
interface Difference {
  type: 'CREATE' | 'REMOVE' | 'CHANGE';
  path: (string | number)[];
  value?: any;
  oldValue?: any;
}

// eslint-disable-next-line import/no-default-export
export default function patch(
  obj: Record<string, any> | any[],
  diffs: Difference[],
): Record<string, any> | any[] {
  let arrayDelQueue = [];
  const removeSymbol = Symbol('micropatch-delete');

  for (const diff of diffs) {
    // eslint-disable-next-line curly
    if (!diff.path || diff.path.length === 0) continue;

    let currObj = obj;
    let diffPathLength = diff.path.length;
    let lastPathElement = diff.path[diffPathLength - 1];
    let secondLastPathElement = diff.path[diffPathLength - 2];
    for (let i = 0; i < diffPathLength - 1; i++) {
      currObj = (currObj as Indexable)[diff.path[i]];
    }

    switch (diff.type) {
      case 'CREATE':
      case 'CHANGE':
        (currObj as Indexable)[lastPathElement] = diff.value;
        break;
      case 'REMOVE':
        if (Array.isArray(currObj)) {
          (currObj as any)[lastPathElement] = removeSymbol;
          // eslint-disable-next-line no-loop-func
          arrayDelQueue.push(() => {
            if (secondLastPathElement !== undefined) {
              (currObj as any)[secondLastPathElement] = (currObj as any)[
                secondLastPathElement
              ].filter((e: any) => e !== removeSymbol);
            } else {
              obj = obj.filter((e: any) => e !== removeSymbol);
            }
          });
        } else {
          delete currObj[lastPathElement];
        }
        break;
    }
  }

  arrayDelQueue.forEach((arrayDeletion) => arrayDeletion());

  return obj;
}
