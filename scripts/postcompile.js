/* eslint-disable no-console */
import { join } from 'path';
import { correctSourceMapsPaths } from './correct-source-maps.js';
import { createPackageFile } from './format-package-json.js';
import { correctMuiIcons } from './mui-icons.js';

const args = process.argv.slice(2);
const packagePath = process.cwd();
const esmDirectoryPath = join(packagePath, './dist/_esm');
const cjsDirectoryPath = join(packagePath, './dist/_cjs');
const distDirectoryPath = join(packagePath, './dist');

createPackageFile(packagePath, distDirectoryPath).then(() =>
  console.log(`Created package.json`),
);

if (args[0] !== '--skip-mui') {
  correctMuiIcons(esmDirectoryPath).then(() =>
    console.log('@mui/icons-material processing complete.'),
  );
}

Promise.all([
  correctSourceMapsPaths(esmDirectoryPath),
  correctSourceMapsPaths(cjsDirectoryPath),
]).then(() => console.log('Source maps correction complete.'));
