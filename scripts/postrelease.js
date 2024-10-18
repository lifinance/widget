import { restorePackageFile } from './formatPackageJson.js'

await restorePackageFile().then(() => console.log('Restored package.json'))
