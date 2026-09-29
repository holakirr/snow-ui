import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { expect, it } from 'vitest'

// Type tests of the built declarations (run `bun run build` first; CI runs
// this after the build with `bun run test:dist`): test/types/*.tsx compiled
// with `tsc` against dist/*.d.ts, as an app would import the package.

const require = createRequire(import.meta.url)

it('compiles test/types against the built declarations', () => {
  const tsc = join(
    dirname(require.resolve('typescript/package.json')),
    'bin/tsc',
  )
  let errors = ''
  try {
    execFileSync(
      process.execPath,
      [tsc, '-p', join(import.meta.dirname, 'types')],
      {
        encoding: 'utf8',
        stdio: 'pipe',
      },
    )
  } catch (error) {
    const { stdout, stderr } = error as { stdout: string; stderr: string }
    errors = stdout + stderr
  }

  // The type errors: which component rejects its ref, or isn't listed.
  expect(errors).toBe('')
}, 60_000)
