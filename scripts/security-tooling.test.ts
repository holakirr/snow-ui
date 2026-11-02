import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { globSync } from 'glob'
import { minimatch } from 'minimatch'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')
const codeConnect = join(root, 'node_modules/@figma/code-connect')
const requireFromCodeConnect = createRequire(join(codeConnect, 'package.json'))
interface Schema {
  parse(value: unknown): unknown
  safeParse(value: unknown): { success: boolean; error?: unknown }
}
const { ParseResponsePayload } = requireFromCodeConnect(
  './dist/connect/parser_executable_types.js',
) as { ParseResponsePayload: Schema }
const { fromError } = requireFromCodeConnect('zod-validation-error') as {
  fromError(error: unknown): Error
}

// These are the actual parent-package contracts behind the security overrides.
// Exercise populated records and error formatting: an empty parser response
// alone would miss a Zod major-version incompatibility.
const response = {
  docs: [
    {
      figmaNode: 'https://www.figma.com/design/example?node-id=1:1',
      component: 'Button',
      variant: { Size: 'Small' },
      template: 'export default Button',
      templateData: { props: { label: { kind: 'string', args: {} } } },
      language: 'tsx',
      label: 'React',
    },
  ],
  messages: [],
}

describe('security-updated tooling compatibility', () => {
  it('preserves Code Connect parser records', () => {
    expect(ParseResponsePayload.parse(response)).toEqual(response)
  })

  it('rejects malformed parser props and formats their errors', () => {
    const result = ParseResponsePayload.safeParse({
      ...response,
      docs: [{ ...response.docs[0], templateData: { props: { label: 42 } } }],
    })
    expect(result.success).toBe(false)
    const error = fromError(result.error)
    expect(error).not.toBeInstanceOf(TypeError)
    expect(error.message).toContain('Validation error')
    expect(error.message).toContain('label')
  })

  it('retains glob and minimatch APIs used by Code Connect and docgen', () => {
    const files = globSync('packages/ui/src/**/*.figma.ts', { cwd: root })
    expect(files).toContain('packages/ui/src/components/Button/Button.figma.ts')
    expect(files.every((file) => minimatch(file, '**/*.figma.ts'))).toBe(true)
    expect(
      minimatch('Button.stories.tsx', '*.stories.{ts,tsx}', {
        matchBase: true,
      }),
    ).toBe(true)
    expect(
      minimatch('Button.test.tsx', '*.stories.{ts,tsx}', { matchBase: true }),
    ).toBe(false)
  })
})
