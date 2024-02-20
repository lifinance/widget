/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
import fastGlob from 'fast-glob';
import fsExtra from 'fs-extra';
import { dirname, join } from 'path';
const { readFileSync, writeFile } = fsExtra;
const { sync } = fastGlob;

const privatePackages = [
  '@lifi/widget-playground',
  '@lifi/widget-playground-next',
  '@lifi/widget-playground-vite',
  '@lifi/widget-embedded',
];
const packagesPath = join(process.cwd(), 'packages');
const directoryPackages = sync('*/package.json', {
  cwd: join(process.cwd(), 'packages'),
}).map(dirname);

async function run() {
  directoryPackages.forEach(async (directoryPackage) => {
    const packageJsonPath = join(
      packagesPath,
      directoryPackage,
      'package.json',
    );

    const json = JSON.parse(readFileSync(packageJsonPath).toString());

    if (privatePackages.includes(json.name)) {
      if (process.argv[2] === 'before') {
        await writeFile(
          packageJsonPath,
          JSON.stringify({ ...json, private: false }, null, 2),
        );
        console.log(`Change ${directoryPackage} private: false.`);
      } else {
        await writeFile(
          packageJsonPath,
          JSON.stringify({ ...json, private: true }, null, 2),
        );
        console.log(`Change ${directoryPackage} private: true.`);
      }
    }
  });
}

run();
