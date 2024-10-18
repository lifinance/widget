import type { FunctionReference } from '../../../../types'

export const addFunctionsAsStrings = (
  configAsString: string,
  functionsReferences: FunctionReference[]
) => {
  let stringifiedConfig = configAsString

  functionsReferences.forEach((item) => {
    const funcString = adaptFuncIndentationToInsertionPoint(
      stringifiedConfig,
      item
    )

    const functionKey = item.path[item.path.length - 1]

    if (funcString.trim().startsWith(`async ${functionKey}`)) {
      stringifiedConfig = stringifiedConfig.replace(
        `"${functionKey}": "${item.substituteId}"`,
        funcString
      )
    } else {
      stringifiedConfig = stringifiedConfig.replace(
        `"${item.substituteId}"`,
        funcString
      )
    }
  })

  return stringifiedConfig
}

// This function corrects the indentation in functions to point in the
// config code that its embedded.
// NOTE: If formatting this output becomes anymore complicated we
// should consider using https://prettier.io/docs/en/browser
const adaptFuncIndentationToInsertionPoint = (
  stringifiedConfig: string,
  item: FunctionReference
) => {
  const funcString = item.funcRef.toString()

  const indexOfInsertationPoint = stringifiedConfig.indexOf(
    `"${item.substituteId}"`
  )
  const stringUntilInsertionPoint = stringifiedConfig.substring(
    0,
    indexOfInsertationPoint
  )
  const lineStart = stringUntilInsertionPoint.lastIndexOf('\n') + 1
  const line = stringUntilInsertionPoint.substring(
    lineStart,
    indexOfInsertationPoint
  )

  const lineIndent = line.length - line.trimStart().length
  const childLineIndent = lineIndent + 2

  const [firstLine, ...remainingLines] = funcString.split('\n')

  if (remainingLines[0]) {
    const baselineSpacesLength =
      remainingLines[0].length - remainingLines[0].trimStart().length

    const reformatedLines = remainingLines.map((line) => {
      const trimmedLine = line.trimStart()
      const indent = line.length - trimmedLine.length
      const adjustment = indent - baselineSpacesLength
      const newIndent = childLineIndent + adjustment

      return ' '.repeat(Math.max(newIndent, lineIndent)) + trimmedLine
    })

    return [firstLine, ...reformatedLines].join('\n')
  }

  return funcString
}
