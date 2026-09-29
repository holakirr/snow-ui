import { useOf } from '@storybook/addon-docs/blocks'
import type { CSSProperties, ReactNode } from 'react'

/*
 * Doc blocks for the usage pages (`*.mdx`). They render in Storybook's docs
 * page, outside the library's theme, so they use inline styles that work on
 * Storybook's own docs background.
 */

/** The owner's licensed copy of the SnowUI Figma kit. */
const FIGMA_FILE = 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/'

/** A Figma node URL in the kit (`33534:43615` or `33534-43615`). */
export const figmaNodeUrl = (nodeId: string) =>
  `${FIGMA_FILE}?node-id=${nodeId.replace(':', '-')}`

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  margin: '8px 0 24px',
  fontSize: 13,
  lineHeight: '20px',
}

const pill: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '2px 10px',
  border: '1px solid rgba(0, 0, 0, 0.15)',
  borderRadius: 999,
  color: 'inherit',
  textDecoration: 'none',
}

const muted: CSSProperties = { opacity: 0.75 }

interface FigmaLinksProps {
  /** The Figma page that documents the component (node id). */
  page?: string
  /** The text of the page link. */
  pageLabel?: string
  /** What `parameters.design` points at, when it isn't a component set. */
  label?: string
  /** Why there is no Figma component, for library extensions. */
  note?: ReactNode
}

/**
 * Links to the component in the SnowUI Figma kit: the node of the attached
 * stories' `parameters.design` (the component set; also shown in the
 * "Design" panel) and, when given, the page that documents it. The file is
 * the owner's licensed copy, so the links only open for people with access.
 */
export const FigmaLinks = ({
  page,
  pageLabel = 'Documentation page',
  label = 'Component set',
  note,
}: FigmaLinksProps) => {
  const resolved = useOf('meta', ['meta'])
  const design = resolved.preparedMeta.parameters?.design as
    | { type?: string; url?: string }
    | undefined
  const url = design?.type === 'figma' ? design.url : undefined

  if (!url && !page) {
    return (
      <p style={{ ...row, ...muted }}>
        <span>Figma: no component in the SnowUI kit.</span>
        {note && <span>{note}</span>}
      </p>
    )
  }

  return (
    <p style={row}>
      <span style={muted}>Figma (licensed file, access required):</span>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" style={pill}>
          {label} ↗
        </a>
      )}
      {page && (
        <a
          href={figmaNodeUrl(page)}
          target="_blank"
          rel="noopener noreferrer"
          style={pill}
        >
          {pageLabel} ↗
        </a>
      )}
      {note && <span style={muted}>{note}</span>}
    </p>
  )
}

const columns: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 16,
  margin: '16px 0 24px',
}

const column = (color: string): CSSProperties => ({
  borderTop: `3px solid ${color}`,
  paddingTop: 8,
})

const heading: CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
}

/** Two columns: `<Do>` and `<Dont>`, each holding a Markdown list. */
export const DoDont = ({ children }: { children: ReactNode }) => (
  <div style={columns}>{children}</div>
)

export const Do = ({ children }: { children: ReactNode }) => (
  <div style={column('#1f9d55')}>
    <p style={heading}>Do</p>
    {children}
  </div>
)

export const Dont = ({ children }: { children: ReactNode }) => (
  <div style={column('#d42020')}>
    <p style={heading}>Don’t</p>
    {children}
  </div>
)
