type Indexable = Record<string | number, any>

interface Difference {
  type: 'CREATE' | 'REMOVE' | 'CHANGE'
  path: (string | number)[]
  value?: any
  oldValue?: any
}

/** Applies microdiff difference objects to a target object (micropatch algorithm). */
export function patch(
  obj: Record<string, any> | any[],
  diffs: Difference[]
): Record<string, any> | any[] {
  const arrayDelQueue = []
  const removeSymbol = Symbol('micropatch-delete')

  let resultObj = obj
  for (const diff of diffs) {
    if (!diff.path || diff.path.length === 0) {
      continue
    }

    let currObj = obj
    const diffPathLength = diff.path.length
    const lastPathElement = diff.path[diffPathLength - 1]
    const secondLastPathElement = diff.path[diffPathLength - 2]
    for (let i = 0; i < diffPathLength - 1; i++) {
      currObj = (currObj as Indexable)[diff.path[i]]
    }

    switch (diff.type) {
      case 'CREATE':
      case 'CHANGE':
        ;(currObj as Indexable)[lastPathElement] = diff.value
        break
      case 'REMOVE':
        if (Array.isArray(currObj)) {
          ;(currObj as any)[lastPathElement] = removeSymbol
          arrayDelQueue.push(() => {
            if (secondLastPathElement !== undefined) {
              ;(currObj as any)[secondLastPathElement] = (currObj as any)[
                secondLastPathElement
              ].filter((e: any) => e !== removeSymbol)
            } else {
              resultObj = obj.filter((e: any) => e !== removeSymbol)
            }
          })
        } else {
          delete currObj[lastPathElement]
        }
        break
    }
  }

  arrayDelQueue.forEach((arrayDeletion) => {
    arrayDeletion()
  })

  return resultObj
}
