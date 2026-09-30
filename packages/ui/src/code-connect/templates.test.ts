import { afterEach, describe, expect, it, vi } from 'vitest'

/*
 * Runs the Code Connect templates (`components/**\/*.figma.ts`) against a
 * stand-in for Figma's template runtime: a selected instance with the given
 * variant values. `figma connect parse` (CI) checks that they bundle; this
 * checks what they render, without a Figma token or the network.
 */

type Properties = Record<string, string | boolean>

const runtime = (properties: Properties) => {
  const read = (name: string) => {
    if (!(name in properties)) throw new Error(`No property "${name}"`)
    return properties[name]
  }
  const selectedInstance = {
    getPropertyValue: read,
    getString: (name: string) => String(read(name)),
    getBoolean: (name: string) => read(name) === true,
    getEnum: (name: string, options: Record<string, unknown>) =>
      name in properties ? options[String(properties[name])] : undefined,
  }
  const template = (strings: TemplateStringsArray, ...values: unknown[]) =>
    String.raw({ raw: strings }, ...values)
  return { default: { selectedInstance, tsx: template } }
}

type Rendered = { example: string; imports: string[] }

const templates = import.meta.glob<{ default: Rendered }>(
  '../components/**/*.figma.ts',
)

const render = async (name: string, properties: Properties) => {
  const path = Object.keys(templates).find((key) =>
    key.endsWith(`/${name}.figma.ts`),
  )
  if (!path) throw new Error(`No template ${name}.figma.ts`)
  vi.resetModules()
  vi.doMock('figma', () => runtime(properties))
  return (await templates[path]()).default
}

afterEach(() => {
  vi.doUnmock('figma')
})

describe('Code Connect templates', () => {
  it('has a template for every connected component', () => {
    expect(Object.keys(templates)).toHaveLength(19)
  })

  it('Button: variant, size, label and icons', async () => {
    const button = await render('Button', {
      Size: 'Medium',
      Variant: 'Filled',
      State: 'Hover',
      'Left Icon': 'True',
      Text: 'True',
      'Right Icon': 'False',
    })
    expect(button.example).toBe(
      '<Button variant="filled" size="md" label="Button" startContent={<DefaultIcon size={16} />} />',
    )
    expect(button.imports).toEqual([
      "import { Button } from '@holakirr/snow-ui'",
      "import { DefaultIcon } from '@holakirr/snow-ui-icons'",
    ])
  })

  it('Button: an icon-only button gets the bigger icon and a name', async () => {
    const button = await render('Button', {
      Size: 'Small',
      Variant: 'Borderless',
      'Left Icon': 'True',
      Text: 'False',
      'Right Icon': 'False',
    })
    expect(button.example).toBe(
      '<Button startContent={<DefaultIcon size={16} />} aria-label="Button" />',
    )
  })

  it('Checkbox: "Multiple" is indeterminate', async () => {
    const checkbox = await render('Checkbox', { Select: 'Multiple' })
    expect(checkbox.example).toBe(
      `<Checkbox defaultChecked={'indeterminate'} aria-label="Label" />`,
    )
  })

  it('Input: the 2-row types have a title; Static is read-only', async () => {
    const input = await render('Input', {
      Type: '2 row vertical',
      State: 'Static',
    })
    expect(input.example).toBe(
      '<Input title="Title" placeholder="Placeholder" readOnly />',
    )
  })

  it('Input: "2 row horizontal" puts the title before the value', async () => {
    const input = await render('Input', {
      Type: '2 row horizontal',
      State: 'Default',
    })
    expect(input.example).toBe(
      '<Input title="Title" titleLayout="horizontal" placeholder="Placeholder" />',
    )
  })

  it('Tag: arrow types become direction-aware shapes without icons', async () => {
    const tag = await render('Tag', {
      Type: 'Left arrow',
      State: 'Active',
      'Left Icon': 'True',
      'Right Icon': 'True',
    })
    expect(tag.example).toBe(
      '<Tag label="Tag" shape="arrow-start" state="active" />',
    )
  })

  it('Tag: the Dot and the close icon', async () => {
    const tag = await render('Tag', {
      Type: 'Default',
      State: 'Default',
      'Left Icon': 'True',
      'Right Icon': 'True',
    })
    expect(tag.example).toBe(
      '<Tag label="Tag" dot onRemove={() => remove()} />',
    )
  })

  it('Tabs: a segmented control', async () => {
    const tabs = await render('Tabs', {
      Size: 'Small',
      Variant: 'Pill',
      State: 'Active',
    })
    expect(tabs.example).toContain(
      '<TabsList variant="pill" size="sm" aria-label="Sections">',
    )
    expect(tabs.example).toContain('<Tabs defaultValue="tab-1">')
  })

  it('Toggle: an active Pill item is a pressed pill toggle', async () => {
    const toggle = await render('Toggle', {
      Size: 'Large',
      Variant: 'Pill',
      State: 'Active',
    })
    expect(toggle.example).toBe(
      '<Toggle variant="pill" size="lg" defaultPressed>Label</Toggle>',
    )
  })

  it('Toaster: a big failure toast', async () => {
    const toaster = await render('Toaster', { State: 'Failure', Big: true })
    expect(toaster.example).toContain(
      "toast({ status: 'error', size: 'lg', title: 'Something went wrong' })",
    )
  })

  it('IconBox: size, background and badge', async () => {
    const icon = await render('IconBox', {
      Size: '40',
      Background: 'True',
      Badge: 'False',
    })
    expect(icon.example).toBe(
      '<IconBox size={40} background>\n  <DefaultIcon />\n</IconBox>',
    )
  })

  it('Link: the Text property is the content', async () => {
    const link = await render('Link', { Text: 'Docs', Variant: 'External' })
    expect(link.example).toBe(
      '<Link href="https://example.com" variant="external">Docs</Link>',
    )
  })

  it('Select: one item per Popover option', async () => {
    const select = await render('Select', { Count: '2' })
    expect(select.example.match(/<SelectItem /g)).toHaveLength(2)
  })

  it.each([
    ['Badge', { Type: 'Number' }, '<Badge content="1">'],
    ['KBD', { Variant: 'Border' }, `keys={['⌘', 'K']} variant="border"`],
    ['Tooltip', { Variant: 'Light' }, '<TooltipContent variant="light">'],
    ['Card', { State: 'Selected', Count: '2' }, '<Card selected'],
    ['Search', { Type: 'Typing' }, 'variant="outline"'],
    ['Switch', { Select: 'True' }, '<Switch defaultChecked'],
    ['RadioGroup', { Select: 'True' }, 'defaultValue="option"'],
    ['IconText', { Vertical: 'True', Flip: 'False' }, ' vertical>Text<'],
    ['Table', {}, '<TableHead sortDirection="asc"'],
  ] as const)('%s', async (name, properties, expected) => {
    const rendered = await render(name, properties)
    expect(rendered.example).toContain(expected)
  })
})
