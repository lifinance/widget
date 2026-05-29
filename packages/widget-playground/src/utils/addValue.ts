/** Sets a nested value on an object using a dot-separated path (object keys only, not arrays). */
export const addValueFromPathString = <ReturnType>(
  object: ReturnType | undefined,
  path: string,
  value: string
): ReturnType | undefined => {
  if (!object) {
    return undefined
  }

  const nodes = path.split('.')

  let lastNodeValue: { [key: string]: any }

  return nodes.reduce<{ [key: string]: any }>(
    (accum, nodeKey, i, arr) => {
      if (i < arr.length - 1) {
        let nodeValue: any

        if (!lastNodeValue) {
          nodeValue = accum[nodeKey] ? { ...accum[nodeKey] } : {}
          accum[nodeKey] = nodeValue
        } else {
          nodeValue = lastNodeValue[nodeKey]
            ? { ...lastNodeValue[nodeKey] }
            : {}
          lastNodeValue[nodeKey] = nodeValue
        }

        lastNodeValue = nodeValue
      } else {
        lastNodeValue[nodeKey] = value
      }

      return accum
    },
    { ...object }
  ) as ReturnType
}
