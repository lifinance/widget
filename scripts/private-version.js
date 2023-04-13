/* eslint-disable no-prototype-builtins */
const fs = require('fs-extra');
const path = require('path');
const glob = require('fast-glob');

const privatePackages = ['@lifi/widget-playground', '@lifi/widget-embedded'];
const packagesPath = path.join(process.cwd(), 'packages');
const directoryPackages = glob
  .sync('*/package.json', { cwd: path.join(process.cwd(), 'packages') })
  .map(path.dirname);

async function run() {
  directoryPackages.forEach(async (directoryPackage) => {
    const packageJsonPath = path.join(
      packagesPath,
      directoryPackage,
      'package.json',
    );

    const json = JSON.parse(fs.readFileSync(packageJsonPath).toString());

    if (privatePackages.includes(json.name)) {
      if (process.argv[2] === 'before') {
        await fs.writeFile(
          packageJsonPath,
          JSON.stringify({ ...json, private: false }, null, 2),
        );
        console.log(`Change ${directoryPackage} private: false.`);
      } else {
        await fs.writeFile(
          packageJsonPath,
          JSON.stringify({ ...json, private: true }, null, 2),
        );
        console.log(`Change ${directoryPackage} private: true.`);
      }
    }
  });
}

run();
