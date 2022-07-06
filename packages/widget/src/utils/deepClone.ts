export const deepClone = <T>(src: T): T => {
  return JSON.parse(JSON.stringify(src));
};
