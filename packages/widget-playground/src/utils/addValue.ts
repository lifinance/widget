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
  value: string
) => {
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
