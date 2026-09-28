import type { CSSProperties, ReactNode } from 'react'

import { Typography } from '../components/Text'
import { twMerge } from '../utils/tw-merge'
import {
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

// Storybook "Foundations" pages, rendered from the token list in tokens.ts.

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
      <Typography as="h1" size={32} semibold>
        {title}
      </Typography>
      <Typography as="p" className="max-w-3xl text-black-40">
        {intro}
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
      <Typography as="h2" size={18} semibold>
        {title}
      </Typography>
      {description && (
        <Typography as="p" className="max-w-3xl text-black-40">
          {description}
        </Typography>
      )}
    </div>
    {children}
  </section>
)

/** `head` is a list of `[label, width class]` pairs (fixed table layout). */
const Table = ({
  head,
  children,
}: {
  head: [string, string][]
  children: ReactNode
}) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-3xl table-fixed border-collapse text-left text-14">
      <thead>
        <tr className="border-b border-black-10 text-12 text-black-40">
          {head.map(([label, width]) => (
            <th key={label} className={twMerge('py-2 pr-4 font-normal', width)}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
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

const ModeValue = ({
  mode,
  token,
}: {
  mode: 'light' | 'dark'
  token: ColorToken
}) => (
  <div className="flex items-center gap-2">
    <span
      className="inline-flex rounded-8 p-1"
      style={{ background: MODE_BACKGROUNDS[mode] }}
    >
      <span
        className="size-6 rounded-4 border border-[rgb(128_128_128/0.3)]"
        style={{ background: token.resolved?.[mode] ?? token[mode] }}
      />
    </span>
    <Code>{token.resolved?.[mode] ?? token[mode]}</Code>
  </div>
)

export const ColorsPage = () => (
  <Page
    title="Colors"
    intro={
      <>
        Figma "Colors" variables, SnowUI-Light and SnowUI-Dark modes. Every
        token is a Tailwind colour (<Code>bg-black-10</Code>,{' '}
        <Code>text-black-40</Code>, <Code>border-black-10</Code>) and a CSS
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
                    <span className="text-12 text-black-40">{token.note}</span>
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
                <span className="text-12 text-black-40">
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
          The design sets <Code>{fontFeatureSettings}</Code> on every text
          layer; the stylesheet applies it to <Code>html</Code> through{' '}
          <Code>--font-sans--font-feature-settings</Code>. The glyphs only
          change when the loaded Inter build contains these features: the Google
          Fonts build (used by this Storybook) doesn't, the full build from
          rsms.me/inter does.
        </>
      }
    >
      <Code>
        html {'{'} font-feature-settings: {fontFeatureSettings}; {'}'}
      </Code>
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
          <span className="text-12 text-black-40">{px}px</span>
        </div>
      ))}
    </div>
  </Page>
)

const ScaleTable = ({
  items,
}: {
  items: { px: number; utility: string }[]
}) => (
  <Table
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
      <ScaleTable items={spacing} />
    </Section>
    <Section title="Size" description="Icons, avatars and controls.">
      <ScaleTable items={sizes} />
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
            <span className="text-12 text-black-40">
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
