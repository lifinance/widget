const path = require('path');
const fse = require('fs-extra');

const packagePath = process.cwd();
const buildPath = path.join(packagePath, './build');

async function includeFileInBuild(file) {
  const sourcePath = path.resolve(packagePath, file);
  const targetPath = path.resolve(buildPath, path.basename(file));
  if (fse.existsSync(sourcePath)) {
    await fse.copy(sourcePath, targetPath);
  }
  console.log(`Copied ${sourcePath} to ${targetPath}`);
}

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
    ...packageDataOther
  } = JSON.parse(packageData);

  const newPackageData = {
    ...packageDataOther,
    private: false,
    ...(packageDataOther.main
      ? {
          main: './cjs/index.js',
          module: './index.js',
          types: './index.d.ts',
        }
      : {}),
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

    await Promise.all(
      ['../../README.md', './CHANGELOG.md', '../../LICENSE.md'].map((file) =>
        includeFileInBuild(file),
      ),
    );

    // TypeScript
    // await typescriptCopy({ from: srcPath, to: buildPath });

    // await createModulePackages({ from: srcPath, to: buildPath });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
