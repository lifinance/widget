/* eslint-disable no-console */
import fsExtra from 'fs-extra';
import { resolve } from 'path';
const { readFile, writeFile } = fsExtra;

export async function createPackageFile(packagePath, path) {
  const packageData = await readFile(
    resolve(packagePath, './package.json'),
    'utf8',
  );
  const {
    nyc,
    scripts,
    devDependencies,
    workspaces,
    files,
    eslintConfig,
    ['lint-staged']: lintStaged,
    ...packageDataOther
  } = JSON.parse(packageData);

  const newPackageData = {
    ...packageDataOther,
    main: './_cjs/index.js',
    module: './_esm/index.js',
    types: './_esm/index.d.ts',
  };

  const targetPath = resolve(path, './package.json');

  await writeFile(targetPath, JSON.stringify(newPackageData, null, 2), 'utf8');

  return newPackageData;
}
