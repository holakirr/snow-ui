import { UserIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { SIZES } from '../../constants'
import { colorOf } from '../../test/colors'
import { cutout, photos } from '../../test/photos'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar/Avatar',
  component: Avatar,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=33400-47953',
    },
  },
  tags: ['autodocs'],
  args: {
    size: SIZES.lg,
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    children: (
      <>
        <AvatarImage src={photos[0]} alt="holakirr" />
        <AvatarFallback>HK</AvatarFallback>
      </>
    ),
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar size="sm">
        <AvatarImage src={photos[0]} alt="holakirr" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarImage src={photos[0]} alt="holakirr" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={photos[0]} alt="holakirr" />
        <AvatarFallback>HK</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const FallbackOnly: Story = {
  args: {
    children: <AvatarFallback>HK</AvatarFallback>,
  },
}

/**
 * The values of `property` in the `:hover` rules that would style `element`
 * under the pointer: the play function's `userEvent` fires events, which
 * don't set `:hover`, so the rules are matched as if everything was hovered.
 */
const hoverRules = (element: Element, property: string) => {
  const found: { value: string; media: string[] }[] = []
  const walk = (rules: CSSRuleList, media: string[]) => {
    for (const rule of rules) {
      // Everything hovered: `:hover` (not the escaped `\:hover` of a class
      // name) matches any element.
      const selector =
        rule instanceof CSSStyleRule
          ? rule.selectorText.replace(/(?<!\\):hover/g, ':is(*)')
          : undefined
      if (
        rule instanceof CSSStyleRule &&
        selector !== rule.selectorText &&
        element.matches(selector as string)
      ) {
        const value = rule.style.getPropertyValue(property)
        if (value) found.push({ value, media })
      }
      if ('cssRules' in rule) {
        walk(
          rule.cssRules as CSSRuleList,
          rule instanceof CSSMediaRule ? [...media, rule.conditionText] : media,
        )
      }
    }
  }
  for (const sheet of element.ownerDocument.styleSheets)
    walk(sheet.cssRules, [])
  return found
}

const hoverValues = (element: Element, property: string) =>
  hoverRules(element, property).map(({ value }) => value)

/** `background` as the browser computes it, inside `container`. */
const resolvedBackground = (background: string, container: Element) => {
  const probe = container.ownerDocument.createElement('span')
  probe.style.background = background
  container.appendChild(probe)
  const { backgroundColor } = getComputedStyle(probe)
  probe.remove()
  return backgroundColor
}

/**
 * Hover, by kind, on an avatar in a link or a button (Figma Component
 * state): a photo zooms in (x1.125 inside the circle); the icon fallback
 * gets a Black/20% fill; the initials grow to 14 Semibold on a lighter fill,
 * White/40% layered over `color-2`. At rest nothing changes, and an avatar on its
 * own (the last one) has no hover.
 */
export const Interactive: Story = {
  args: { size: SIZES.md },
  render: (args) => (
    <div className="flex items-center gap-4">
      <a href="#profile" className="rounded-full focus-ring">
        <Avatar {...args}>
          <AvatarImage src={cutout} alt="Profile" />
          <AvatarFallback>HK</AvatarFallback>
        </Avatar>
      </a>
      <button
        type="button"
        aria-label="Sign in"
        className="rounded-full focus-ring"
      >
        <Avatar {...args}>
          <AvatarFallback>
            <UserIcon aria-hidden />
          </AvatarFallback>
        </Avatar>
      </button>
      <button
        type="button"
        aria-label="Frank"
        className="rounded-full focus-ring"
      >
        <Avatar {...args}>
          <AvatarFallback>F</AvatarFallback>
        </Avatar>
      </button>
      <Avatar {...args} data-testid="static">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step('a photo zooms in, its fill unchanged', async () => {
      const link = canvas.getByRole('link')
      const avatar = link.firstElementChild as HTMLElement
      // The picture replaces the fallback once it has loaded.
      await waitFor(() => expect(link).toHaveAccessibleName('Profile'))
      const picture = avatar.querySelector('img') as HTMLImageElement
      await expect(getComputedStyle(picture).scale).toBe('none')
      // The kit: the picture 27px in the 24px circle, which clips it.
      await expect(hoverValues(picture, 'scale')).toEqual(['1.125'])
      await expect(getComputedStyle(avatar).overflow).toBe('hidden')
      await expect(hoverValues(avatar, 'background-color')).toEqual([])
    })

    await step('the icon fallback gets a Black/20% fill', async () => {
      const button = canvas.getByRole('button', { name: 'Sign in' })
      const fallback = button
        .querySelector('svg')
        ?.closest('.bg-color-2') as Element
      await expect(getComputedStyle(fallback).backgroundColor).toBe(
        colorOf('text-color-2', button),
      )
      const [fill] = hoverValues(fallback, 'background-color')
      // Black/20% on white, opaque: the same gray in both themes.
      await expect(resolvedBackground(fill, fallback)).toBe(
        resolvedBackground('color-mix(in srgb, #000 20%, #fff)', fallback),
      )
    })

    await step(
      'the initials grow to 14 Semibold on a lighter fill',
      async () => {
        const initials = canvas.getByText('F')
        await expect(getComputedStyle(initials).fontWeight).toBe('400')
        // Container units resolve once the avatar is laid out (Firefox
        // reports the viewport's before).
        await waitFor(() =>
          expect(getComputedStyle(initials).fontSize).toBe('12px'),
        )
        await expect(hoverValues(initials, 'font-weight')).toEqual([
          'var(--font-weight-semibold)',
        ])
        // 14px in the 24 and 32px avatars, 14/12 of the resting size above.
        await expect(hoverValues(initials, 'font-size')).toEqual([
          'max(0.875rem, 43.75cqi)',
        ])
        // White/40% layered over the fill (which stays, so a fill set in
        // `className` shows through), not a new fill.
        const fallback = initials.parentElement as Element
        await expect(hoverValues(fallback, 'background-color')).toEqual([])
        const tints = hoverValues(fallback, 'background-image')
        await expect(tints).toHaveLength(1)
        await expect(tints[0]).toMatch(
          /^linear-gradient\(var\(--avatar-hover-tint\),\s*var\(--avatar-hover-tint\)\)$/,
        )
        await expect(
          resolvedBackground('var(--avatar-hover-tint)', fallback),
        ).toBe(
          resolvedBackground(
            'color-mix(in srgb, #fff 40%, transparent)',
            fallback,
          ),
        )
      },
    )

    await step('only where the pointer can hover, as `hover:`', async () => {
      // A tap on a touch screen doesn't leave the hover on.
      const initials = canvas.getByText('F')
      const rules = [
        ...hoverRules(
          canvas.getByRole('link').firstElementChild as Element,
          'background-color',
        ),
        ...hoverRules(
          canvas
            .getByRole('button', { name: 'Sign in' })
            .querySelector('svg')
            ?.closest('.bg-color-2') as Element,
          'background-color',
        ),
        ...hoverRules(initials, 'font-weight'),
        ...hoverRules(initials.parentElement as Element, 'background-image'),
        ...hoverRules(
          canvas.getByRole('link').querySelector('img') as Element,
          'scale',
        ),
      ]
      await expect(rules.length).toBeGreaterThan(0)
      for (const { media } of rules) {
        await expect(media.join(' ').replace(/\s/g, '')).toContain(
          '(hover:hover)',
        )
      }
    })

    await step('an avatar on its own has no hover', async () => {
      const avatar = canvas.getByTestId('static')
      const initials = canvas.getByText('S')
      for (const element of [avatar, initials, initials.parentElement]) {
        for (const property of [
          'background-color',
          'font-weight',
          'font-size',
          'background-image',
          'filter',
        ]) {
          await expect(hoverValues(element as Element, property)).toEqual([])
        }
      }
    })
  },
}
