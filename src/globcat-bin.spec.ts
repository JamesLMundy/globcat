import { resolve } from 'node:path'
import { exec } from 'node:child_process'
import { assert, test } from 'vitest'

test('should execute without errors', () => {
  const cwd = process.cwd()
  const file = resolve(cwd, 'src', 'globcat-bin.ts')
  const glob = `'test-files/**/*.txt' 'test-files/foo.txt'`
  const command = `pnpm ts-node-esm --transpileOnly --project tsconfig.json ${file} ${glob}`
  return new Promise<void>((done) => {
    exec(
      command,
      {
        cwd
      },
      (err, stdout, stderr) => {
        assert.notExists(err, 'no errors')
        assert.equal(stderr, '', 'should not have error output')
        assert.match(stdout, /bar\s+baz\s+foo\s+/, 'should equal file contents')
        done()
      }
    )
  })
})
