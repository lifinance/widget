import { restorePackageFile } from './formatPackageJson.js'

await restorePackageFile().then(() => console.log('Restored package.json'))

// Promise.all([correctSourceMapsPaths(esmDirectoryPath)]).then(() =>
//   console.log('Source maps correction complete.')
// )
