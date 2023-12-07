// FIXME: https://github.com/mui/material-ui/issues/35233
import fsExtra from 'fs-extra';
import { join } from 'path';
const { stat: _stat, readFile, readdir, writeFile } = fsExtra;

const replaceInFile = async (filePath) => {
  let content = await readFile(filePath, 'utf8');
  const regex = /@mui\/icons-material\/(?!esm\/)([^;]+)/g;
  const replacement = '@mui/icons-material/esm/$1';
  content = content.replace(regex, replacement);
  await writeFile(filePath, content, 'utf8');
};

export const correctMuiIcons = async (dir) => {
  const files = await readdir(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = await _stat(fullPath);
    if (stat.isDirectory()) {
      await correctMuiIcons(fullPath);
    } else if (fullPath.endsWith('.js')) {
      await replaceInFile(fullPath);
    }
  }
};
