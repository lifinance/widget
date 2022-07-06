const path = require('path');
const fse = require('fs-extra');
const glob = require('fast-glob');

const packagePath = process.cwd();
const buildPath = path.join(packagePath, './build');
const srcPath = path.join(packagePath, './src');

async function includeFileInBuild(file) {
  const sourcePath = path.resolve(packagePath, file);
  const targetPath = path.resolve(buildPath, path.basename(file));
  if (fse.existsSync(sourcePath)) {
    await fse.copy(sourcePath, targetPath);
  }
  console.log(`Copied ${sourcePath} to ${targetPath}`);
}

async function createModulePackages({ from, to }) {
  const directoryPackages = glob
    .sync('*/index.{js,ts,tsx}', { cwd: from })
    .map(path.dirname);

  console.log(directoryPackages);

  await Promise.all(
    directoryPackages.map(async (directoryPackage) => {
      const packageJsonPath = path.join(to, directoryPackage, 'package.json');

      const packageJson = {
        sideEffects: false,
        module: './index.js',
        main: './index.js',
        types: './index.d.ts',
      };

      const [typingsEntryExist, moduleEntryExists, mainEntryExists] =
        await Promise.all([
          fse.pathExists(
            path.resolve(path.dirname(packageJsonPath), packageJson.types),
          ),
          fse.pathExists(
            path.resolve(path.dirname(packageJsonPath), packageJson.module),
          ),
          fse.pathExists(
            path.resolve(path.dirname(packageJsonPath), packageJson.main),
          ),
          fse.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2)),
        ]);

      const manifestErrorMessages = [];
      if (!typingsEntryExist) {
        manifestErrorMessages.push(
          `'types' entry '${packageJson.types}' does not exist.`,
        );
      }
      if (!moduleEntryExists) {
        manifestErrorMessages.push(
          `'module' entry '${packageJson.module}' does not exist.`,
        );
      }
      if (!mainEntryExists) {
        manifestErrorMessages.push(
          `'main' entry '${packageJson.main}' does not exist.`,
        );
      }
      if (manifestErrorMessages.length > 0) {
        throw new Error(
          `${packageJsonPath}:\n${manifestErrorMessages.join('\n')}`,
        );
      }

      return packageJsonPath;
    }),
  );
}

async function typescriptCopy({ from, to }) {
  if (!(await fse.pathExists(to))) {
    console.warn(`Path ${to} does not exists.`);
    return [];
  }

  const files = await glob('**/*.d.ts', { cwd: from });
  const cmds = files.map((file) =>
    fse.copy(path.resolve(from, file), path.resolve(to, file)),
  );
  return Promise.all(cmds);
}

async function createPackageFile() {
  const packageData = await fse.readFile(
    path.resolve(packagePath, './package.json'),
    'utf8',
  );
  const { nyc, scripts, devDependencies, workspaces, ...packageDataOther } =
    JSON.parse(packageData);

  const newPackageData = {
    ...packageDataOther,
    private: false,
    ...(packageDataOther.main
      ? {
          main: './index.js',
          module: './index.js',
        }
      : {}),
    types: './index.d.ts',
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
      ['./README.md', './CHANGELOG.md', '../../LICENSE.md'].map((file) =>
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
