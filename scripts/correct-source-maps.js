import fsExtra from 'fs-extra';
import { join } from 'path';
const { stat: _stat, readFile, readdir, writeFile } = fsExtra;

const replaceInFile = async (filePath) => {
  let content = await readFile(filePath, 'utf8');
  const regex = '../src/';
  const replacement = '';
  content = content.replace(regex, replacement);
  await writeFile(filePath, content, 'utf8');
};

export const correctSourceMapsPaths = async (dir) => {
  const files = await readdir(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = await _stat(fullPath);
    if (stat.isDirectory()) {
      await correctSourceMapsPaths(fullPath);
    } else if (fullPath.endsWith('.map')) {
      await replaceInFile(fullPath);
    }
  }
};
