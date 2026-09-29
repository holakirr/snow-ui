import type { StorybookConfig } from '@storybook/react-vite'

/*
 * The props tables on the docs pages (`<Controls />`, `<ArgTypes of={…} />`)
 * come from react-docgen-typescript, which reads the components' types with
 * the TypeScript compiler, so it follows what the components are built from:
 * Radix primitives (`ComponentProps<typeof RadioGroupPrimitive.Root>`), cva
 * variants (`VariantProps<typeof buttonVariants>`) and shared prop types.
 *
 * TypeScript 7, the repository's compiler, has no JavaScript API, so the
 * docgen packages are patched (patches/) to use TypeScript 6's, from
 * `@typescript/typescript6`. scripts/docs-pages.test.ts checks the tables.
 */

type DocgenOptions = NonNullable<
  NonNullable<StorybookConfig['typescript']>['reactDocgenTypescriptOptions']
>
type PropFilter = NonNullable<DocgenOptions['propFilter']>
type PropItem = Parameters<Extract<PropFilter, (...args: never) => unknown>>[0]

/**
 * Packages whose declared props are part of a component's API: the Radix
 * primitives the parts forward to (`value`, `onValueChange`, `open`,
 * `asChild`, `side`…), cva variants, the react-hook-form adapter's
 * `Controller` props and Recharts' `Legend` and `Tooltip` (`ChartLegend`,
 * `ChartTooltip`; not the SVG attributes Recharts' types repeat).
 */
const API_PACKAGES =
  /\/node_modules\/(@radix-ui\/[^/]+|class-variance-authority|react-hook-form|recharts\/types\/component)\//

/**
 * Calendar forwards react-day-picker's `DayPickerProps` (100+ props): the
 * table lists the ones for picking dates and navigating; the page links to
 * react-day-picker's reference for the rest (custom components, formatters,
 * class names…).
 */
const DAY_PICKER_PROPS = new Set([
  'mode',
  'selected',
  'onSelect',
  'required',
  'min',
  'max',
  'excludeDisabled',
  'resetOnSelect',
  'disabled',
  'modifiers',
  'month',
  'defaultMonth',
  'onMonthChange',
  'numberOfMonths',
  'startMonth',
  'endMonth',
  'captionLayout',
  'fixedWeeks',
  'showWeekNumber',
  'today',
  'timeZone',
  'locale',
  'dir',
  'footer',
  'onDayClick',
  'autoFocus',
])

/**
 * Keeps the props the tables should show: the components' own (declared in
 * the repository), the API packages' above and `className` (every component
 * merges it with its classes). The long tail of DOM attributes (`onClick`,
 * `aria-*`, `tabIndex`… from `@types/react`) is left out: each page says
 * which element the rest of the props go to.
 */
export const propFilter = (prop: PropItem) => {
  // Every declaration counts: Badge's own `content` also exists on
  // `HTMLAttributes`, and either may come first.
  const fileNames = (
    prop.declarations ?? (prop.parent ? [prop.parent] : [])
  ).map(({ fileName }) => fileName)
  if (fileNames.length === 0) return true
  if (fileNames.some((fileName) => !fileName.includes('/node_modules/'))) {
    return true
  }
  if (fileNames.some((fileName) => API_PACKAGES.test(fileName))) return true
  if (fileNames.some((fileName) => fileName.includes('/react-day-picker/'))) {
    return DAY_PICKER_PROPS.has(prop.name)
  }
  return prop.name === 'className'
}

export const reactDocgenTypescriptOptions = {
  // The workspace packages' sources (see the file's comments).
  tsconfigPath: '.storybook/tsconfig.docgen.json',
  // The files whose components get docgen (relative to the repository root).
  include: [
    'packages/ui/src/**/*.tsx',
    'packages/charts/src/**/*.tsx',
    'packages/icons/src/lib/IconBase.tsx',
  ],
  exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/src/test/**'],
  // `size?: 'sm' | 'md'` is listed as its values, not as a type name.
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Don't rename the components: parts that are a Radix part as it is
  // (`Dialog` and `Sheet` are both `@radix-ui/react-dialog`'s `Root`) would
  // share one name in the stories' code snippets.
  setDisplayName: false,
  propFilter,
} satisfies DocgenOptions
