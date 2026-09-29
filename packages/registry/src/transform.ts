import type { Module } from './graph'
import type { TextEdit } from './plan'

/** `lines` as a block comment (`/* … *\/`, not JSDoc, so it documents nothing). */
export const blockComment = (lines: string[]) =>
  ['/*', ...lines.map((line) => (line ? ` * ${line}` : ' *')), ' */'].join('\n')

/**
 * The content of a shipped file: the source with its import rewrites and the
 * licence header.
 *
 * The header goes after the imports, not at the top: the shadcn CLI writes
 * `sourceFile.getText()`, which drops every comment before the first
 * statement, and with `rsc: false` it removes a leading `'use client'`, so a
 * header before or right after the directive would be lost. A file without
 * imports gets the header at its end.
 */
export function transformSource(
  module: Module,
  edits: readonly TextEdit[],
  header: string[],
): string {
  const text = module.source.getFullText()
  const imports = module.source.getImportDeclarations()
  const comment = blockComment(header)
  const last = imports[imports.length - 1]
  const headerEdit: TextEdit = last
    ? { start: last.getEnd(), end: last.getEnd(), text: `\n\n${comment}` }
    : {
        start: text.length,
        end: text.length,
        text: `${text.endsWith('\n') ? '' : '\n'}\n${comment}\n`,
      }
  // Right to left, so earlier offsets stay valid; the header (zero width at
  // the end of the last import) goes in before that import's own rewrite.
  const all = [...edits, headerEdit].sort((a, b) => b.start - a.start)
  let result = text
  for (const edit of all) {
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end)
  }
  return result
}
