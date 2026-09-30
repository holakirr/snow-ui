import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// GitHub runs a `run:` step without an explicit shell as `bash -e {0}`: no
// pipefail, so `failing-command | tee log` passes. `shell: bash` runs
// `bash --noprofile --norc -eo pipefail {0}`. Every workflow with `run:`
// steps sets it as the default, and no step picks another shell.
const dir = join(import.meta.dirname, '../.github/workflows')
const workflows = readdirSync(dir)
  .filter((file) => /\.ya?ml$/.test(file))
  .map((file) => ({ file, source: readFileSync(join(dir, file), 'utf8') }))

describe('workflows', () => {
  it.each(workflows.filter(({ source }) => /^\s+run:/m.test(source)))(
    '$file runs its steps in bash with pipefail',
    ({ source }) => {
      expect(source).toMatch(/^defaults:\n {2}run:\n {4}shell: bash\n/m)
      expect(source.match(/^\s+shell: (?!bash\s*$).*$/gm) ?? []).toEqual([])
    },
  )
})
