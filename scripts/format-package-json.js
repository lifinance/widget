import { resolve } from 'node:path'
import fsExtra from 'fs-extra'
const { readFile, writeFile } = fsExtra

export async function createPackageFile(packagePath, path) {
  const packageData = await readFile(
    resolve(packagePath, './package.json'),
    'utf8'
  )
  const {
    nyc,
    scripts,
    devDependencies,
    workspaces,
    files,
    eslintConfig,
    'lint-staged': lintStaged,
    ...packageDataOther
  } = JSON.parse(packageData)

  const newPackageData = {
    ...packageDataOther,
    main: './_esm/index.js',
    types: './_esm/index.d.ts',
    exports: {
      '.': {
        types: './_esm/index.d.ts',
        default: './_esm/index.js',
      },
      './package.json': './package.json',
      ...(packageDataOther.name === '@lifi/widget'
        ? { './skeleton': './_esm/components/Skeleton/WidgetSkeleton.js' }
        : {}),
    },
  }

  const targetPath = resolve(path, './package.json')

  await writeFile(targetPath, JSON.stringify(newPackageData, null, 2), 'utf8')

  return newPackageData
}
