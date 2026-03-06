/** biome-ignore-all lint/correctness/noUnusedVariables: allowed in scripts */
import { resolve } from 'node:path'
import fsExtra from 'fs-extra'

const { readFile, writeFile, copy, remove } = fsExtra

export async function formatPackageFile() {
  const originalPackageJsonPath = resolve(process.cwd(), './package.json')
  const packageTmpPath = resolve(process.cwd(), './package.json.tmp')

  const packageData = await readFile(originalPackageJsonPath, 'utf8')

  await copy(originalPackageJsonPath, packageTmpPath)

  const {
    nyc,
    scripts,
    devDependencies,
    workspaces,
    files,
    ...packageDataOther
  } = JSON.parse(packageData)

  const subpathExports = {}
  if (packageDataOther.exports) {
    for (const [key, value] of Object.entries(packageDataOther.exports)) {
      if (key === '.' || key === './package.json') {
        continue
      }
      const srcPath = typeof value === 'string' ? value : value.default
      if (typeof srcPath === 'string' && srcPath.startsWith('./src/')) {
        const distPath = srcPath
          .replace('./src/', './dist/esm/')
          .replace(/\.tsx?$/, '.js')
        const typesPath = srcPath
          .replace('./src/', './dist/esm/')
          .replace(/\.tsx?$/, '.d.ts')
        subpathExports[key] = {
          types: typesPath,
          default: distPath,
        }
      }
    }
  }

  const newPackageData = {
    ...packageDataOther,
    main: './dist/esm/index.js',
    types: './dist/esm/index.d.ts',
    exports: {
      '.': {
        types: './dist/esm/index.d.ts',
        default: './dist/esm/index.js',
      },
      ...(packageDataOther.name === '@lifi/widget'
        ? {
            './skeleton': {
              types: './dist/esm/components/Skeleton/WidgetSkeleton.d.ts',
              default: './dist/esm/components/Skeleton/WidgetSkeleton.js',
            },
          }
        : {}),
      ...subpathExports,
      './package.json': './package.json',
    },
  }

  await writeFile(
    originalPackageJsonPath,
    JSON.stringify(newPackageData, null, 2),
    'utf8'
  )

  return newPackageData
}

export async function restorePackageFile() {
  try {
    const originalPackageJsonPath = resolve(process.cwd(), './package.json')
    const packageTmpPath = resolve(process.cwd(), './package.json.tmp')

    await copy(packageTmpPath, originalPackageJsonPath)
    await remove(packageTmpPath)
  } catch (_error) {
    console.warn('Post release failed.')
  }
}
