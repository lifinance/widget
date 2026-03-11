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
          import: distPath,
        }
      }
    }
  }

  const skeletonExport =
    packageDataOther.name === '@lifi/widget'
      ? {
          './skeleton': {
            types: './dist/esm/components/Skeleton/WidgetSkeleton.d.ts',
            import: './dist/esm/components/Skeleton/WidgetSkeleton.js',
          },
        }
      : {}

  const allSubpathExports = { ...skeletonExport, ...subpathExports }

  const typesVersions = {}
  for (const [key, value] of Object.entries(allSubpathExports)) {
    const subpath = key.replace('./', '')
    typesVersions[subpath] = [value.types]
  }

  const newPackageData = {
    ...packageDataOther,
    main: './dist/esm/index.js',
    module: './dist/esm/index.js',
    types: './dist/esm/index.d.ts',
    ...(Object.keys(typesVersions).length > 0
      ? { typesVersions: { '*': typesVersions } }
      : {}),
    files: [
      'dist/**',
      '!dist/**/*.tsbuildinfo',
      'src/**/*.ts',
      'src/**/*.tsx',
      '!src/**/*.spec.ts',
      '!src/**/*.test.ts',
      '!src/**/*.mock.ts',
      '!src/**/*.handlers.ts',
      '!src/**/*.tsbuildinfo',
      '!**/__mocks__/**',
      '!*.tmp',
      '!*.env',
      '!tsconfig.json',
    ],
    exports: {
      '.': {
        types: './dist/esm/index.d.ts',
        import: './dist/esm/index.js',
      },
      ...allSubpathExports,
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
