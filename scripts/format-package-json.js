/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');

const packagePath = process.cwd();
const buildPath = path.join(packagePath, './dist');

async function createPackageFile() {
  const packageData = await fse.readFile(
    path.resolve(packagePath, './package.json'),
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
    main: './src/_cjs/index.js',
    module: './src/_esm/index.js',
    types: './src/_esm/index.d.ts',
  };

  const targetPath = path.resolve(buildPath, './package.json');

  await fse.writeFile(
    targetPath,
    JSON.stringify(newPackageData, null, 2),
    'utf8',
  );
  console.log(`Created package.json in ${targetPath}.`);

  return newPackageData;
}

async function run() {
  try {
    await createPackageFile();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
