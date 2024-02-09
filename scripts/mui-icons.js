// FIXME: https://github.com/mui/material-ui/issues/35233
import fsExtra from 'fs-extra';
import { join } from 'path';
const { stat: _stat, readFile, readdir, writeFile } = fsExtra;

const replaceInFile = async (filePath) => {
  // let content = await readFile(filePath, 'utf8');
  // Regular expression to find the import statement
  // const iconsMaterialRegex =
  //   /import {\s*([\w\s,]+)\s*} from '@mui\/icons-material';/gs;
  // const materialStyle = "from '@mui/material/styles'";
  // const materialStyleReplace = "from '@mui/material/styles/index.js'";
  // Replace the found import statement with individual import lines
  // content = content.replace(iconsMaterialRegex, (match, iconNames) => {
  //   return iconNames
  //     .split(',')
  //     .map((name) => name.trim())
  //     .filter((name) => name.length)
  //     .map(
  //       (name) => `import ${name} from '@mui/icons-material/esm/${name}.js';`,
  //     )
  //     .join('\n');
  // });
  // .replace(materialStyle, materialStyleReplace);
  // await writeFile(filePath, content, 'utf8');
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
