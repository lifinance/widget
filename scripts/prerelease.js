import { formatPackageFile } from './formatPackageJson.js'

// biome-ignore lint/suspicious/noConsole: allowed in scripts
await formatPackageFile().then(() => console.log('Created package.json'))

// Promise.all([correctSourceMapsPaths(esmDirectoryPath)]).then(() =>
//   console.log('Source maps correction complete.')
// )
