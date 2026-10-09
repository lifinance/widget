import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Outside the widget's own include, so an ordinary test run never prints the
// report or writes its file. The root has no vitest, so `it` comes in as a
// global rather than an import. Printing is the point here, so the console is
// not intercepted: vitest 5 otherwise swallows it for a passing test.
export default {
  test: {
    root: dirname(fileURLToPath(import.meta.url)),
    include: ['report.js'],
    globals: true,
    disableConsoleIntercept: true,
  },
}
