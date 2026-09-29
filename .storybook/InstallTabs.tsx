import {
  type CSSProperties,
  type KeyboardEvent,
  lazy,
  type ReactNode,
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import chartsPackage from '../packages/charts/package.json'
import manifest from '../packages/registry/manifest.json'
import uiPackage from '../packages/ui/package.json'
import { addedIn } from './added-in'

/*
 * `<InstallTabs item="button" />`: how to install a component, from the
 * registry manifest (packages/registry/manifest.json, generated from the
 * sources): the npm package, the shadcn CLI (@snow-ui registry) or by hand.
 * Registered for every MDX page in preview.tsx (`docs.components`), so a page
 * needs no import. Inline styles, like the other blocks: the docs page is
 * outside the library's theme.
 */

/*
 * Storybook's Source block (highlighting, copy button), loaded when a tab
 * renders: @storybook/addon-docs/blocks touches `document` when it is
 * imported, and preview.tsx (which registers this block) is also imported
 * on the server by the SSR test (ssr/stories.ts).
 */
const LazySource = lazy(() =>
  import('@storybook/addon-docs/blocks').then(({ Source }) => ({
    default: Source,
  })),
)

const Source = ({ code, language }: { code: string; language: string }) => (
  <Suspense
    fallback={
      <pre style={{ margin: '16px 0', padding: 16, overflowX: 'auto' }}>
        <code>{code}</code>
      </pre>
    }
  >
    <LazySource code={code} language={language as 'tsx'} />
  </Suspense>
)

interface Item {
  name: string
  type: string
  title: string
  files?: string[]
  license?: boolean
  dependencies?: string[]
  registryDependencies?: string[]
  import?: string
  exports?: string[]
  docs?: string
}

const items = new Map(
  (manifest.items as unknown as Item[]).map((item) => [item.name, item]),
)
const REGISTRY = manifest.baseUrl
const TARGET = 'components/snow-ui'
const CHARTS = 'snow-ui-charts'
const GUIDE = '?path=/docs/guides-registry--docs'

const ranges: Record<string, string> = {
  ...uiPackage.devDependencies,
  ...uiPackage.peerDependencies,
  ...uiPackage.dependencies,
  [uiPackage.name]: `^${uiPackage.version}`,
  [chartsPackage.name]: `^${chartsPackage.version}`,
}

const MANAGERS = {
  npm: { add: 'npm install', dlx: 'npx' },
  pnpm: { add: 'pnpm add', dlx: 'pnpm dlx' },
  yarn: { add: 'yarn add', dlx: 'yarn dlx' },
  bun: { add: 'bun add', dlx: 'bunx --bun' },
} as const
type Manager = keyof typeof MANAGERS
const STORAGE_KEY = 'snow-ui:package-manager'

const TABS = [
  ['npm', 'npm package'],
  ['shadcn', 'shadcn CLI'],
  ['manual', 'Manual'],
] as const
type Tab = (typeof TABS)[number][0]

const box: CSSProperties = {
  margin: '8px 0 24px',
  border: '1px solid rgba(0, 0, 0, 0.15)',
  borderRadius: 12,
  fontSize: 14,
  lineHeight: '20px',
}
const bar: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: '8px 12px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
}
const tabStyle = (selected: boolean): CSSProperties => ({
  padding: '4px 10px',
  border: 0,
  borderRadius: 8,
  background: selected ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
  color: 'inherit',
  font: 'inherit',
  fontWeight: selected ? 600 : 400,
  cursor: 'pointer',
})
const panel: CSSProperties = { padding: '4px 16px 12px' }
const note: CSSProperties = { margin: '8px 0' }
const mono: CSSProperties = { ...note, fontFamily: 'monospace', fontSize: 13 }

/** The export an import line shows: the item's namesake, else its first. */
const mainExport = (item: Item, name?: string) =>
  name ??
  (item.exports?.includes(item.title) ? item.title : item.exports?.[0]) ??
  item.title

/** Every item `item` needs, recursively (not itself), in dependency order. */
const itemClosure = (item: Item) => {
  const seen = new Set<string>([item.name])
  const order: Item[] = []
  const visit = (current: Item) => {
    for (const dep of current.registryDependencies ?? []) {
      const next = items.get(dep)
      if (!next || seen.has(dep)) continue
      seen.add(dep)
      visit(next)
      order.push(next)
    }
  }
  visit(item)
  return order
}

const withRange = (name: string) =>
  ranges[name] ? `${name}@${ranges[name]}` : name

const docsLink = (item: Item) =>
  item.docs ? `?path=/docs/${item.docs}--docs` : `${REGISTRY}/${item.name}.json`

function readManager(): Manager {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored && stored in MANAGERS ? (stored as Manager) : 'npm'
  } catch {
    return 'npm'
  }
}

type Loaded = { files: { target?: string; content?: string }[] } | 'error'

/** An item's files with their source, from the built registry. */
function useRegistryItem(name: string, enabled: boolean) {
  const [loaded, setLoaded] = useState<Loaded>()
  useEffect(() => {
    if (!enabled || loaded) return
    let cancelled = false
    const load = async (): Promise<Loaded> => {
      // This deployment's copy (/r/ next to Storybook), else the published one.
      for (const url of [
        new URL(`r/${name}.json`, window.location.href).href,
        `${REGISTRY}/${name}.json`,
      ]) {
        try {
          const response = await fetch(url)
          if (response.ok) return (await response.json()) as Loaded
        } catch {
          // Try the next copy.
        }
      }
      return 'error'
    }
    load().then((result) => {
      if (!cancelled) setLoaded(result)
    })
    return () => {
      cancelled = true
    }
  }, [enabled, name, loaded])
  return loaded
}

/** Links to the items an item needs (their docs page, else their JSON). */
const ItemLinks = ({ names }: { names: string[] }) => (
  <>
    {names.map((dep, i) => {
      const depItem = items.get(dep)
      return (
        <span key={dep}>
          {i ? ', ' : ''}
          {depItem ? <a href={docsLink(depItem)}>{dep}</a> : dep}
        </span>
      )
    })}
  </>
)

export interface InstallTabsProps {
  /** The registry item (`packages/registry/manifest.json`), e.g. `button`. */
  item: string
  /** The export the import lines show, when it isn't the item's own. */
  name?: string
}

export const InstallTabs = ({ item: itemName, name }: InstallTabsProps) => {
  const item = items.get(itemName)
  const id = useId()
  const [tab, setTab] = useState<Tab>('npm')
  const [manager, setManager] = useState<Manager>('npm')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => setManager(readManager()), [])
  const loaded = useRegistryItem(itemName, tab === 'manual' && !!item?.files)

  if (!item) {
    return (
      <p style={{ ...note, color: '#c00' }}>
        InstallTabs: no item “{itemName}” in packages/registry/manifest.json.
      </p>
    )
  }

  const pm = MANAGERS[manager]
  const charts = item.name === CHARTS
  const exported = mainExport(item, name)
  const npmEntry = charts
    ? chartsPackage.name
    : item.name === 'react-hook-form'
      ? `${uiPackage.name}/react-hook-form`
      : uiPackage.name
  const add = `${pm.dlx} shadcn@latest add @snow-ui/${item.name}`
  const theme = charts
    ? `@import "tailwindcss";\n@import "${uiPackage.name}/theme.css";\n@import "${chartsPackage.name}/styles.css";`
    : `@import "tailwindcss";\n@import "${uiPackage.name}/theme.css";\n@import "${uiPackage.name}/fonts.css";`
  const deps = item.registryDependencies ?? []
  // By hand, the items it needs are copied too, recursively: their npm
  // packages must be direct dependencies (pnpm doesn't hoist the others).
  const allItems = itemClosure(item)
  const npmPackages = [
    ...new Set(
      [item, ...allItems].flatMap((current) => current.dependencies ?? []),
    ),
  ].sort()

  const chooseManager = (next: Manager) => {
    setManager(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not remembered, e.g. in a private window.
    }
  }
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.findIndex(([key]) => key === tab)
    const targets: Record<string, number | undefined> = {
      ArrowRight: (index + 1) % TABS.length,
      ArrowLeft: (index + TABS.length - 1) % TABS.length,
      Home: 0,
      End: TABS.length - 1,
    }
    const next = targets[event.key]
    if (next === undefined) return
    event.preventDefault()
    setTab(TABS[next][0])
    tabRefs.current[next]?.focus()
  }

  const panels: Record<Tab, ReactNode> = {
    npm: (
      <>
        <Source
          language="bash"
          code={`${pm.add} ${charts ? `${chartsPackage.name} ${uiPackage.name}` : uiPackage.name}`}
        />
        <p style={note}>
          In your stylesheet, on Tailwind CSS v4 (without Tailwind, import{' '}
          <code>{uiPackage.name}/index.css</code> instead of the theme):
        </p>
        <Source language="css" code={theme} />
        <Source
          language="tsx"
          code={`import { ${exported} } from '${npmEntry}'`}
        />
      </>
    ),
    shadcn: charts ? (
      <>
        <Source language="bash" code={add} />
        <p style={note}>
          The charts stay an npm package: this adds{' '}
          <code>{chartsPackage.name}</code> and its stylesheet to your project.
          See <a href={GUIDE}>Registry</a>.
        </p>
        <Source
          language="tsx"
          code={`import { ${exported} } from '${chartsPackage.name}'`}
        />
      </>
    ) : (
      <>
        <Source language="bash" code={add} />
        <p style={note}>
          Copies the source into <code>{TARGET}/</code>
          {deps.length ? (
            <>
              {' '}
              with the items it uses (<ItemLinks names={deps} />)
            </>
          ) : null}{' '}
          and installs their npm dependencies. The project needs the{' '}
          <code>@snow-ui</code> registry and the SnowUI theme: in a new project,{' '}
          <code>{`${pm.dlx} shadcn@latest init ${REGISTRY}/snow-ui.json`}</code>
          {'; in an existing one, see '}
          <a href={GUIDE}>Registry</a>.
        </p>
        {item.import ? (
          <Source
            language="tsx"
            code={`import { ${exported} } from '@/${TARGET}/${item.import}'`}
          />
        ) : null}
      </>
    ),
    manual: charts ? (
      <p style={note}>
        The charts are only published on npm: see the npm package tab.
      </p>
    ) : (
      <>
        <p style={note}>1. Install the npm dependencies:</p>
        <Source
          language="bash"
          code={`${pm.add} ${[uiPackage.name, ...npmPackages].map(withRange).join(' ')}`}
        />
        <p style={note}>
          2. Import the theme in your stylesheet (the package provides the
          tokens and fonts; the components are copied):
        </p>
        <Source language="css" code={theme} />
        {deps.length ? (
          <p style={note}>
            3. Copy the items it uses, the same way (with the ones they use):{' '}
            <ItemLinks names={allItems.map((i) => i.name)} />.
          </p>
        ) : null}
        <p style={note}>
          {deps.length ? 4 : 3}. Copy these files into <code>{TARGET}/</code> in
          your components folder, keeping their paths (they import each other
          relatively):
        </p>
        {loaded && loaded !== 'error' ? (
          loaded.files.map((file) => (
            <div key={file.target}>
              <p style={mono}>
                {file.target?.replace(/^@components\//, 'components/')}
              </p>
              {file.content ? (
                <Source
                  language={file.target?.endsWith('LICENSE') ? 'md' : 'tsx'}
                  code={file.content}
                />
              ) : null}
            </div>
          ))
        ) : (
          <ul>
            {[...(item.files ?? []), ...(item.license ? ['LICENSE'] : [])].map(
              (file) => (
                <li key={file}>
                  <code>
                    {TARGET}/{file}
                  </code>
                </li>
              ),
            )}
          </ul>
        )}
        <p style={note}>
          {loaded === 'error'
            ? 'The sources could not be loaded here; they are in '
            : 'Registry item: '}
          <a href={`${REGISTRY}/${item.name}.json`}>
            {REGISTRY}/{item.name}.json
          </a>
          .
        </p>
      </>
    ),
  }

  const since = addedIn[item.name]

  return (
    <section style={box} aria-label={`Install ${item.title}`}>
      {since && (
        <p style={{ ...note, marginTop: 0 }}>
          Added in {uiPackage.name} {since}.
        </p>
      )}
      <div style={bar}>
        <div role="tablist" aria-label="Installation method">
          {TABS.map(([key, label], index) => (
            <button
              key={key}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`${id}-${key}`}
              aria-selected={tab === key}
              aria-controls={`${id}-panel`}
              tabIndex={tab === key ? 0 : -1}
              style={tabStyle(tab === key)}
              onClick={() => setTab(key)}
              onKeyDown={onKeyDown}
            >
              {label}
            </button>
          ))}
        </div>
        <label style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          Package manager
          <select
            value={manager}
            onChange={(event) => chooseManager(event.target.value as Manager)}
            style={{ font: 'inherit' }}
          >
            {Object.keys(MANAGERS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${tab}`}
        style={panel}
      >
        {panels[tab]}
      </div>
    </section>
  )
}
