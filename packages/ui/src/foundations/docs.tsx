import type { CSSProperties, ReactNode } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/Accordion'
import {
  Checkbox,
  Input,
  RadioGroup,
  RadioGroupItem,
  Switch,
} from '../components/Input'
import { Search } from '../components/Search'
import { Skeleton } from '../components/Skeleton'
import { Typography } from '../components/Text'
import { twMerge } from '../utils/tw-merge'
import {
  animations,
  blurs,
  type ColorToken,
  colorGroups,
  deprecatedColors,
  focusRing,
  fontFeatureSettings,
  glass,
  radii,
  shadows,
  sizes,
  spacing,
  textStyles,
} from './tokens'

// Storybook "Foundations" pages, rendered from the token data in tokens.ts
// (generated from the DTCG tokens by `bun run tokens`).

const MODE_BACKGROUNDS = { light: '#fff', dark: '#333' }

const Code = ({ children }: { children: ReactNode }) => (
  <code className="font-mono text-12 text-black-80 break-words">
    {children}
  </code>
)

const Page = ({
  title,
  intro,
  children,
}: {
  title: string
  intro: ReactNode
  children: ReactNode
}) => (
  <div className="flex max-w-5xl flex-col gap-10 p-8 text-black">
    <header className="flex flex-col gap-2">
      <Typography asChild size={32} semibold>
        <h1>{title}</h1>
      </Typography>
      <Typography asChild className="max-w-3xl text-secondary">
        <p>{intro}</p>
      </Typography>
    </header>
    {children}
  </div>
)

const Section = ({
  title,
  description,
  children,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
}) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <Typography asChild size={18} semibold>
        <h2>{title}</h2>
      </Typography>
      {description && (
        <Typography asChild className="max-w-3xl text-secondary">
          <p>{description}</p>
        </Typography>
      )}
    </div>
    {children}
  </section>
)

/** `head` is a list of `[label, width class]` pairs (fixed table layout). */
const Table = ({
  label,
  head,
  children,
}: {
  /** Names the scrollable region (and the table) for assistive technology. */
  label: string
  head: [string, string][]
  children: ReactNode
}) => (
  // A horizontally scrollable region must be reachable with the keyboard
  // (axe `scrollable-region-focusable`, WCAG 2.1.1).
  <section
    // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs focus so keyboard users can scroll it
    tabIndex={0}
    aria-label={label}
    className="overflow-x-auto rounded-4 focus-ring"
  >
    <table className="w-full min-w-3xl table-fixed border-collapse text-left text-14">
      <caption className="sr-only">{label}</caption>
      <thead>
        <tr className="border-b border-black-10 text-12 text-secondary">
          {head.map(([label, width]) => (
            <th key={label} className={twMerge('py-2 pr-4 font-normal', width)}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </section>
)

const Row = ({ children }: { children: ReactNode }) => (
  <tr className="border-b border-black-4 align-middle">{children}</tr>
)

const Cell = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => <td className={twMerge('py-3 pr-4', className)}>{children}</td>

const checkerboard: CSSProperties = {
  backgroundImage:
    'conic-gradient(rgb(0 0 0 / 0.06) 25%, transparent 0 50%, rgb(0 0 0 / 0.06) 0 75%, transparent 0)',
  backgroundSize: '12px 12px',
}

const ColorValue = ({
  mode,
  color,
  label,
}: {
  mode: 'light' | 'dark'
  color: string
  label?: string
}) => (
  <div className="flex items-center gap-2">
    <span
      className="inline-flex rounded-8 p-1"
      style={{ background: MODE_BACKGROUNDS[mode] }}
    >
      <span
        className="size-6 rounded-4 border border-[rgb(128_128_128/0.3)]"
        style={{ background: color }}
      />
    </span>
    <Code>{color}</Code>
    {label && <span className="text-12 text-secondary">{label}</span>}
  </div>
)

/** A token's value in a mode, and its "more" value for the contrast tokens. */
const ModeValue = ({
  mode,
  token,
}: {
  mode: 'light' | 'dark'
  token: ColorToken
}) => (
  <div className="flex flex-col gap-1">
    <ColorValue mode={mode} color={token.resolved?.[mode] ?? token[mode]} />
    {token.contrastMore && (
      <ColorValue
        mode={mode}
        color={token.contrastMore[mode]}
        label="more contrast"
      />
    )}
  </div>
)

export const ColorsPage = () => (
  <Page
    title="Colors"
    intro={
      <>
        Figma "Colors" variables, SnowUI-Light and SnowUI-Dark modes. Every
        token is a Tailwind colour (<Code>bg-black-10</Code>,{' '}
        <Code>text-secondary</Code>, <Code>border-black-10</Code>) and a CSS
        variable (<Code>var(--color-black-10)</Code>). The preview column
        follows the theme toolbar; the Light and Dark columns always show both
        modes.
      </>
    }
  >
    {colorGroups.map((group) => (
      <Section
        key={group.title}
        title={group.title}
        description={group.description}
      >
        <Table
          label={`${group.title} colour tokens`}
          head={[
            ['Preview', 'w-18'],
            ['Token', 'w-[26%]'],
            ['Figma', 'w-[20%]'],
            ['Light', ''],
            ['Dark', ''],
          ]}
        >
          {group.tokens.map((token) => (
            <Row key={token.name}>
              <Cell>
                <span
                  className="flex size-10 rounded-12 border border-black-10"
                  style={checkerboard}
                >
                  <span
                    className={twMerge('size-full rounded-12', token.swatch)}
                  />
                </span>
              </Cell>
              <Cell>
                <div className="flex flex-col gap-0.5">
                  <Code>{token.name}</Code>
                  {token.note && (
                    <span className="text-12 text-secondary">{token.note}</span>
                  )}
                </div>
              </Cell>
              <Cell className="text-black-80">{token.figma}</Cell>
              <Cell>
                <ModeValue mode="light" token={token} />
              </Cell>
              <Cell>
                <ModeValue mode="dark" token={token} />
              </Cell>
            </Row>
          ))}
        </Table>
      </Section>
    ))}

    <Section
      title="Deprecated names"
      description="Still work as aliases of the tokens above; removed in the next major."
    >
      <Table
        label="Deprecated colour names"
        head={[
          ['Old', 'w-[30%]'],
          ['Use instead', 'w-[30%]'],
          ['Example', ''],
        ]}
      >
        {deprecatedColors.map(({ name, use }) => (
          <Row key={name}>
            <Cell>
              <Code>{name}</Code>
            </Cell>
            <Cell>
              <Code>{use}</Code>
            </Cell>
            <Cell>
              <Code>
                bg-{name} → bg-{use}
              </Code>
            </Cell>
          </Row>
        ))}
      </Table>
    </Section>
  </Page>
)

/** Shorter sample for the display sizes, so Regular and Semibold fit side by side. */
const sample = (size: number) => (size >= 48 ? 'SnowUI' : 'Snow design system')

export const TypographyPage = () => (
  <Page
    title="Typography"
    intro={
      <>
        Figma text styles: Inter in Regular (400) and Semibold (600), 16 styles
        in 8 sizes. Use <Code>{'<Typography size={14} semibold>'}</Code> or the{' '}
        <Code>text-14</Code> utility (font size and line height). Typography
        defaults to 14 Regular.
      </>
    }
  >
    <Section title="Text styles">
      <Table
        label="Text styles"
        head={[
          ['Style', 'w-32'],
          ['Regular', ''],
          ['Semibold', ''],
        ]}
      >
        {textStyles.map(({ size, lineHeight, utility }) => (
          <Row key={size}>
            <Cell className="whitespace-nowrap">
              <div className="flex flex-col gap-0.5">
                <Code>{utility}</Code>
                <span className="text-12 text-secondary">
                  {size} / {lineHeight}px
                </span>
              </div>
            </Cell>
            <Cell>
              <Typography size={size}>{sample(size)}</Typography>
            </Cell>
            <Cell>
              <Typography size={size} semibold>
                {sample(size)}
              </Typography>
            </Cell>
          </Row>
        ))}
      </Table>
    </Section>

    <Section
      title="OpenType features"
      description={
        <>
          The design sets <Code>{fontFeatureSettings}</Code> (open digits and
          the alternate one) on every text layer; the stylesheet applies it to{' '}
          <Code>html</Code> through{' '}
          <Code>--font-sans--font-feature-settings</Code>. The glyphs only
          change when the loaded Inter build contains these features: the Google
          Fonts build doesn't, the rsms build in{' '}
          <Code>@holakirr/snow-ui/fonts.css</Code> (used by this Storybook)
          does.
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <Code>
          html {'{'} font-feature-settings: {fontFeatureSettings}; {'}'}
        </Code>
        <div className="flex items-center gap-6">
          <span className="text-48">1 3 4 6 9</span>
          <span className="text-12 text-secondary">{fontFeatureSettings}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-48" style={{ fontFeatureSettings: 'normal' }}>
            1 3 4 6 9
          </span>
          <span className="text-12 text-secondary">normal</span>
        </div>
      </div>
    </Section>
  </Page>
)

export const RadiusPage = () => (
  <Page
    title="Radius"
    intro={
      <>
        Figma "Corner Radius" scale (Standard density): <Code>rounded-4</Code> …{' '}
        <Code>rounded-80</Code>, or <Code>var(--radius-12)</Code>. Tailwind's
        own names (<Code>rounded-xl</Code> = 12px) still work;{' '}
        <Code>rounded-md</Code> (6px) is not on the design scale.
      </>
    }
  >
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-6">
      {radii.map(({ px, utility }) => (
        <div key={px} className="flex flex-col gap-2">
          <div
            className={twMerge(
              'h-24 border border-black-10 bg-black-4',
              utility,
            )}
          />
          <Code>{utility}</Code>
          <span className="text-12 text-secondary">{px}px</span>
        </div>
      ))}
    </div>
  </Page>
)

const ScaleTable = ({
  label,
  items,
}: {
  label: string
  items: { px: number; utility: string }[]
}) => (
  <Table
    label={label}
    head={[
      ['Figma', 'w-24'],
      ['Tailwind', 'w-48'],
      ['Scale', ''],
    ]}
  >
    {items.map(({ px, utility }) => (
      <Row key={px}>
        <Cell>{px}px</Cell>
        <Cell>
          <Code>{utility}</Code>
        </Cell>
        <Cell>
          <span
            className="block h-3 rounded-4 bg-indigo"
            style={{ width: px }}
          />
        </Cell>
      </Row>
    ))}
  </Table>
)

export const SpacingPage = () => (
  <Page
    title="Spacing"
    intro="Figma's Spacing and Size variables (Standard density) are multiples of 4px, which is Tailwind's spacing unit, so they map to the regular spacing utilities; there are no extra tokens. The Expanded and Condensed density modes are not implemented."
  >
    <Section title="Spacing" description="Padding, margin and gap.">
      <ScaleTable label="Spacing scale" items={spacing} />
    </Section>
    <Section title="Size" description="Icons, avatars and controls.">
      <ScaleTable label="Size scale" items={sizes} />
    </Section>
  </Page>
)

const EffectCard = ({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) => (
  <div
    className={twMerge(
      'flex h-24 items-center justify-center rounded-16 bg-background-1',
      className,
    )}
  >
    {children}
  </div>
)

const blurBackdrop: CSSProperties = {
  backgroundImage:
    'radial-gradient(circle at 20% 30%, #adadfb 0 18%, transparent 19%), radial-gradient(circle at 70% 60%, #ffb55b 0 16%, transparent 17%), radial-gradient(circle at 45% 80%, #6be6d3 0 14%, transparent 15%), linear-gradient(135deg, #e6f1fd, #edeefc)',
}

export const EffectsPage = () => (
  <Page
    title="Effects"
    intro="Figma effect styles as Tailwind shadow, ring and blur tokens. Their colours are raw values, so, as in Figma, they do not change in dark mode."
  >
    <Section title="Shadows">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-6 rounded-24 bg-background-2 p-6">
        {shadows.map(({ figma, utility, value, note }) => (
          <div key={utility} className="flex flex-col gap-2">
            <EffectCard
              className={twMerge(
                utility,
                utility === 'inset-shadow-inner' && 'bg-primary',
              )}
            />
            <Code>{utility}</Code>
            <span className="text-12 text-secondary">
              {figma}
              {note && ` · ${note}`}
            </span>
            <Code>{value}</Code>
          </div>
        ))}
      </div>
    </Section>

    <Section
      title="Focus ring"
      description={
        <>
          Figma "Focus": a 4px ring at black 4%. It is too faint to be a focus
          indicator on its own, so components use the <Code>focus-ring</Code>{' '}
          utility: on <Code>:focus-visible</Code> it draws the Figma ring plus a
          2px <Code>black-80</Code> outline, offset by 2px (12.6:1 in light
          mode, 8.7:1 in dark mode). Press Tab to focus the second card.
        </>
      }
    >
      <div className="flex items-center gap-6 rounded-24 bg-background-2 p-6">
        <EffectCard className={twMerge('w-48', focusRing.utility)}>
          <Code>{focusRing.utility}</Code>
        </EffectCard>
        <button
          type="button"
          className="focus-ring w-48 rounded-16 bg-background-1 p-4 text-left"
        >
          <Code>focus-ring</Code>
        </button>
        <Code>
          {focusRing.variable}: {focusRing.value}
        </Code>
      </div>
    </Section>

    <Section
      title="Background blur"
      description="Figma blur values are twice the CSS value: Background blur 40 is backdrop-filter: blur(20px)."
    >
      <div
        className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-6 rounded-24 p-6"
        style={blurBackdrop}
      >
        {blurs.map(({ figma, utility, value }) => (
          <div
            key={utility}
            className={twMerge(
              'flex h-32 flex-col justify-end gap-1 rounded-16 bg-white-20 p-3',
              utility,
            )}
          >
            <Code>{utility}</Code>
            <span className="text-12 text-black-80">
              {figma} · {value}
            </span>
          </div>
        ))}
      </div>
    </Section>

    <Section
      title="Glass"
      description="An approximation: CSS has no refraction, so the glass utilities combine a fill, a background blur and the Glass effect's drop shadow."
    >
      <div
        className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-6 rounded-24 p-6"
        style={blurBackdrop}
      >
        {glass.map(({ utility, figma, recipe }) => (
          <div
            key={utility}
            className={twMerge(
              'flex h-32 flex-col justify-end gap-1 rounded-16 p-3',
              utility,
            )}
          >
            <Code>{utility}</Code>
            <span className="text-12 text-black-80">
              {figma} · {recipe}
            </span>
          </div>
        ))}
      </div>
    </Section>
  </Page>
)

const ScrollBox = ({
  label,
  className,
  horizontal = false,
}: {
  label: string
  className?: string
  horizontal?: boolean
}) => (
  <div className="flex flex-col gap-2">
    <section
      // A scroll container is a tab stop, so keyboard users can scroll it.
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region needs to be focusable
      tabIndex={0}
      aria-label={label}
      data-scrollbar-sample={label}
      className={twMerge(
        'h-40 w-56 rounded-16 bg-background-2 p-3 focus-ring',
        horizontal ? 'overflow-x-auto' : 'overflow-y-auto',
        className,
      )}
    >
      <div
        className={twMerge(
          'flex gap-2 text-12 text-secondary',
          horizontal ? 'w-[40rem] flex-row' : 'flex-col',
        )}
      >
        {Array.from({ length: horizontal ? 12 : 16 }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static sample rows
          <span key={index} className="shrink-0 rounded-8 bg-black-4 px-2 py-1">
            Row {index + 1}
          </span>
        ))}
      </div>
    </section>
    <Code>{className ?? 'the browser default'}</Code>
  </div>
)

export const ScrollbarPage = () => (
  <Page
    title="Scrollbar"
    intro={
      <>
        The Figma "Scrollbar": a 4px rounded thumb that widens to 8px under the
        pointer, in the <Code>control-border</Code> colour (the Figma Black/20%;
        3:1 or more with more contrast), with no track. Add the{' '}
        <Code>scrollbar-snow</Code> utility to a scroll container. Browsers with
        the WebKit scrollbar pseudo-elements (Chrome, Edge, Safari) draw the
        kit's thumb; Firefox draws its thin scrollbar in the same colour.
        Nothing animates, and forced-colors mode keeps the system scrollbar.
      </>
    }
  >
    <Section title="Vertical and horizontal">
      <div className="flex flex-wrap gap-6">
        <ScrollBox label="Default scrollbar" />
        <ScrollBox label="SnowUI scrollbar" className="scrollbar-snow" />
        <ScrollBox
          label="SnowUI scrollbar, horizontal"
          className="scrollbar-snow"
          horizontal
        />
      </div>
    </Section>
  </Page>
)

export const MotionPage = () => (
  <Page
    title="Motion"
    intro={
      <>
        The animation tokens of <Code>theme.css</Code> and what they become when
        the OS asks for reduced motion (
        <Code>prefers-reduced-motion: reduce</Code>, WCAG 2.3.3). Overlays then
        fade instead of sliding or zooming, with the same timing, so their state
        changes stay visible; the Accordion opens at once. Components that move
        with Tailwind utilities use <Code>motion-reduce:</Code>: the Button
        press, the Switch thumb, the Dialog zoom, the Accordion chevron and the
        Skeleton pulse.
      </>
    }
  >
    <Section title="Animation tokens">
      <Table
        label="Animation tokens"
        head={[
          ['Utility', 'w-[30%]'],
          ['Keyframes', 'w-[20%]'],
          ['Reduced motion', 'w-[20%]'],
          ['Used by', ''],
        ]}
      >
        {animations.map(({ utility, keyframes, reduced, via, usedBy }) => (
          <Row key={utility}>
            <Cell>
              <div className="flex items-center gap-3">
                {/* Runs once when the page opens (the play test reads it). */}
                <span
                  data-motion={utility}
                  className={twMerge(
                    'size-6 shrink-0 overflow-hidden rounded-8 bg-color-2',
                    utility,
                  )}
                />
                <Code>{utility}</Code>
              </div>
            </Cell>
            <Cell>
              <Code>{keyframes}</Code>
            </Cell>
            <Cell>
              <Code>{reduced}</Code>
              {via === 'component' && (
                <span className="block text-12 text-secondary">
                  in the component
                </span>
              )}
            </Cell>
            <Cell className="text-black-80">{usedBy}</Cell>
          </Row>
        ))}
      </Table>
    </Section>

    <Section
      title="Components"
      description="With reduced motion the Skeleton stops pulsing, the Switch thumb and the Accordion chevron jump instead of sliding and turning, a Dialog only fades in and a pressed Button doesn't shrink."
    >
      <div className="flex flex-wrap items-center gap-8 rounded-24 bg-background-2 p-6">
        <Skeleton data-motion="skeleton" className="h-10 w-40" />
        <Switch data-motion="switch" aria-label="Notifications" />
        <Accordion type="single" collapsible className="w-64">
          <AccordionItem value="details">
            <AccordionTrigger data-motion="accordion">Details</AccordionTrigger>
            <AccordionContent>It opens without animating.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Section>
  </Page>
)

/** One theme, painted, in a contrast scope set by its parent. */
const ContrastSample = ({ theme }: { theme: 'light' | 'dark' }) => (
  <div
    data-theme={theme}
    data-contrast-sample={theme}
    className="flex flex-col gap-4 rounded-24 bg-background-1 p-6 text-black"
  >
    <Typography size={14} semibold>
      {theme === 'light' ? 'Light' : 'Dark'}
    </Typography>
    <div className="flex items-center gap-4">
      <Checkbox aria-label={`Checkbox, ${theme}`} />
      <RadioGroup aria-label={`Radio, ${theme}`}>
        <RadioGroupItem value="one" aria-label="One" />
      </RadioGroup>
      <Switch aria-label={`Switch off, ${theme}`} />
      <Switch aria-label={`Switch on, ${theme}`} defaultChecked />
    </div>
    <Input aria-label={`Input, ${theme}`} placeholder="Placeholder" />
    <Search aria-label={`Search, ${theme}`} shortcut={[]} />
  </div>
)

export const ContrastPage = () => (
  <Page
    title="Contrast"
    intro={
      <>
        Form controls follow the SnowUI Figma kit by default, whose unchecked
        rings, field strokes, Switch track and placeholders are under WCAG AA
        (1.6:1 for Black/20%). With more contrast — the OS setting{' '}
        <Code>prefers-contrast: more</Code>, or{' '}
        <Code>data-contrast="more"</Code> on any element — the{' '}
        <Code>control-border</Code>, <Code>control-border-strong</Code> and{' '}
        <Code>placeholder</Code> tokens take WCAG AA values (3:1 for boundaries,
        4.5:1 for text), strokes get 1px, gray fields get a ring and the Switch
        thumb flips to the per-mode <Code>white</Code>.{' '}
        <Code>data-contrast="standard"</Code> switches a subtree back. Contrast
        and theme scopes combine at any depth.
      </>
    }
  >
    {(['standard', 'more'] as const).map((contrast) => (
      <Section
        key={contrast}
        title={contrast === 'standard' ? 'Standard (Figma)' : 'More (WCAG AA)'}
        description={
          <>
            <Code>data-contrast="{contrast}"</Code> on the section, the theme on
            each panel.
          </>
        }
      >
        <div data-contrast={contrast} className="grid grid-cols-2 gap-6">
          <ContrastSample theme="light" />
          <ContrastSample theme="dark" />
        </div>
      </Section>
    ))}
  </Page>
)
