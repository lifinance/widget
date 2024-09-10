/* eslint-disable no-console */
import { join } from 'path';
import { correctSourceMapsPaths } from './correct-source-maps.js';
import { createPackageFile } from './format-package-json.js';

const args = process.argv.slice(2);
const packagePath = process.cwd();
const esmDirectoryPath = join(packagePath, './dist/_esm');
const distDirectoryPath = join(packagePath, './dist');

createPackageFile(packagePath, distDirectoryPath).then(() =>
  console.log(`Created package.json`),
);

Promise.all([correctSourceMapsPaths(esmDirectoryPath)]).then(() =>
  console.log('Source maps correction complete.'),
);
