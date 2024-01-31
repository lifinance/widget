export const valueFromPath = <T>(object: T | undefined, path: string) => {
  if (!object) return undefined;

  const splitPath = path.split('.');

  let value = object;
  for (let i = 0; i < splitPath.length; i++) {
    value = (value as any)[splitPath[i]];
    if (value === undefined) {
      break;
    }
  }

  return value as typeof value;
};
