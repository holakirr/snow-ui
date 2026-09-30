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
const hoverValues = (element: Element, property: string) => {
  const values: string[] = []
  const walk = (rules: CSSRuleList) => {
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
        if (value) values.push(value)
      }
      if ('cssRules' in rule) walk(rule.cssRules as CSSRuleList)
    }
  }
  for (const sheet of element.ownerDocument.styleSheets) walk(sheet.cssRules)
  return values
}

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
 * state): a photo gets a `color-1` underlay, seen through a cut-out picture;
 * the icon fallback a Black/20% fill; the initials turn semibold. At rest
 * nothing changes, and an avatar on its own (the last one) has no hover.
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
    await step('a photo gets a color-1 underlay', async () => {
      const link = canvas.getByRole('link')
      const avatar = link.firstElementChild as HTMLElement
      // The picture replaces the fallback once it has loaded.
      await waitFor(() => expect(link).toHaveAccessibleName('Profile'))
      await expect(getComputedStyle(avatar).backgroundColor).toBe(
        'rgba(0, 0, 0, 0)',
      )
      await expect(hoverValues(avatar, 'background-color')).toEqual([
        'var(--color-color-1)',
      ])
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

    await step('the initials turn semibold', async () => {
      const initials = canvas.getByText('F')
      await expect(getComputedStyle(initials).fontWeight).toBe('400')
      await expect(hoverValues(initials, 'font-weight')).toEqual([
        'var(--font-weight-semibold)',
      ])
    })

    await step('an avatar on its own has no hover', async () => {
      const avatar = canvas.getByTestId('static')
      const initials = canvas.getByText('S')
      for (const element of [avatar, initials, initials.parentElement]) {
        for (const property of ['background-color', 'font-weight', 'filter']) {
          await expect(hoverValues(element as Element, property)).toEqual([])
        }
      }
    })
  },
}
