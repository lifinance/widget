// FIXME: https://github.com/mui/material-ui/issues/35233
const fs = require('fs-extra');
const path = require('path');

const packagePath = process.cwd();
const directoryPath = path.join(packagePath, './dist/_esm');

const replaceInFile = async (filePath) => {
  let content = await fs.readFile(filePath, 'utf8');
  const regex = /@mui\/icons-material\/(?!esm\/)([^;]+)/g;
  const replacement = '@mui/icons-material/esm/$1';
  content = content.replace(regex, replacement);
  await fs.writeFile(filePath, content, 'utf8');
};

const walkDirectory = async (dir) => {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await walkDirectory(fullPath);
    } else if (fullPath.endsWith('.js')) {
      await replaceInFile(fullPath);
    }
  }
};

walkDirectory(directoryPath).then(() =>
  // eslint-disable-next-line no-console
  console.log('@mui/icons-material processing complete.'),
);
