import { formatPackageFile } from './formatPackageJson.js'

await formatPackageFile().then(() => console.log('Created package.json'))

// Promise.all([correctSourceMapsPaths(esmDirectoryPath)]).then(() =>
//   console.log('Source maps correction complete.')
// )
