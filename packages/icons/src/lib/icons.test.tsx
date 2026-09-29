import { CheckCircle, Warning } from '@phosphor-icons/react/dist/ssr'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import * as lib from '../main'
import type { CustomIconWeights, Icon } from './types'

const icons = Object.entries(lib).filter(
  (entry): entry is [string, Icon] =>
    typeof entry[1] === 'function' &&
    entry[0].endsWith('Icon') &&
    entry[0] !== 'StatusIcon',
)

// Pair each icon with its weight map (defs/X.tsx <-> ssr/X.tsx) to know which weights it defines.
const defModules = import.meta.glob<Record<string, CustomIconWeights>>(
  './defs/*.tsx',
  {
    eager: true,
  },
)
const iconModules = import.meta.glob<Record<string, Icon>>('./ssr/*.tsx', {
  eager: true,
})
const weightCases = Object.entries(defModules).map(
  ([path, mod]): [string, Icon, CustomIconWeights] => {
    const [name, Icon] = Object.entries(
      iconModules[path.replace('/defs/', '/ssr/')],
    )[0]
    return [name, Icon, Object.values(mod)[0]]
  },
)

const getSvg = (container: HTMLElement) => {
  const svg = container.querySelector('svg')
  if (!svg) throw new Error('svg not rendered')
  return svg
}

/** The markup of an icon without its generated ids, which differ per render. */
const getShape = (container: HTMLElement) =>
  getSvg(container).innerHTML.replace(/(id="|url\(#)[^")]+/g, '$1')

describe('icons', () => {
  it('exports all 49 icons', () => {
    expect(icons).toHaveLength(49)
    expect(weightCases).toHaveLength(49)
  })

  // LoadingBIcon is drawn on a 24x24 grid and overrides the viewBox on purpose.
  const customViewBox: Record<string, string> = { LoadingBIcon: '0 0 24 24' }

  it.each(icons)('%s renders an <svg> with a 32x32 viewBox', (name, Icon) => {
    const { container } = render(<Icon />)
    const svg = getSvg(container)
    expect(svg).toHaveAttribute('viewBox', customViewBox[name] ?? '0 0 32 32')
    expect(svg.childElementCount).toBeGreaterThan(0)
  })

  it.each(weightCases)(
    '%s falls back to regular for weights it does not define',
    (_name, Icon, weights) => {
      const regular = getShape(render(<Icon />).container)
      for (const weight of Object.values(lib.ICON_WEIGHTS)) {
        const html = getShape(render(<Icon weight={weight} />).container)
        if (weights.has(weight)) expect(html.length).toBeGreaterThan(0)
        else expect(html).toBe(regular)
      }
    },
  )

  it('gives every icon on the page its own gradient ids', () => {
    const { container } = render(
      <>
        <lib.NotepadIcon />
        <lib.NotepadIcon size={48} />
      </>,
    )

    const ids = Array.from(container.querySelectorAll('[id]'), (el) => el.id)
    expect(ids).toHaveLength(8)
    expect(new Set(ids).size).toBe(ids.length)
    // Each fill points at a gradient of its own icon.
    for (const svg of container.querySelectorAll('svg')) {
      for (const shape of svg.querySelectorAll('[fill^="url(#"]')) {
        const id = shape.getAttribute('fill')?.slice(5, -1) ?? ''
        expect(svg.querySelector(`[id="${id}"]`)?.tagName).toBe(
          'linearGradient',
        )
      }
    }
  })

  it('draws SnowUIIcon in its colour, with the snowflake cut out', () => {
    const { container } = render(
      <>
        <lib.SnowUIIcon color="red" />
        <lib.SnowUIIcon />
      </>,
    )
    const [red, current] = container.querySelectorAll('svg')

    expect(red).toHaveAttribute('fill', 'red')
    expect(current).toHaveAttribute('fill', 'currentColor')
    for (const svg of [red, current]) {
      // No hard-coded black: the bars inherit the icon's fill; the only
      // white shapes are the translucent highlights and the mask.
      expect(svg.querySelector('[fill="black"]:not(mask *)')).toBeNull()
      const mask = svg.querySelector('mask')
      const masked = svg.querySelector('g[mask]')
      expect(masked?.getAttribute('mask')).toBe(`url(#${mask?.id})`)
      expect(masked?.querySelectorAll('path:not([fill])')).toHaveLength(4)
      for (const highlight of masked?.querySelectorAll('[fill="white"]') ??
        []) {
        expect(highlight).toHaveAttribute('fill-opacity')
      }
    }
    // Every icon has its own mask.
    expect(red.querySelector('mask')?.id).not.toBe(
      current.querySelector('mask')?.id,
    )
  })

  it('falls back to the regular weight when a weight is missing', () => {
    const { AddIcon } = lib
    const regular = getSvg(render(<AddIcon />).container).innerHTML
    const fill = getSvg(render(<AddIcon weight="fill" />).container).innerHTML
    expect(fill).toBe(regular)
  })

  it('renders a different shape for a supported weight', () => {
    const { StarIcon } = lib
    const regular = getSvg(render(<StarIcon />).container).innerHTML
    const fill = getSvg(render(<StarIcon weight="fill" />).container).innerHTML
    expect(fill).not.toBe(regular)
  })
})

describe('accessibility', () => {
  const { AddIcon } = lib

  it('is aria-hidden without alt or aria-label', () => {
    const svg = getSvg(render(<AddIcon />).container)
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
    expect(svg.querySelector('title')).toBeNull()
  })

  it('gets role img and a <title> with alt', () => {
    render(<AddIcon alt="Add item" />)
    const svg = screen.getByRole('img', { name: 'Add item' })
    expect(svg).not.toHaveAttribute('aria-hidden')
    expect(svg.querySelector('title')).toHaveTextContent('Add item')
  })

  it('stays accessible with aria-label', () => {
    render(<AddIcon aria-label="Add" />)
    const svg = screen.getByRole('img', { name: 'Add' })
    expect(svg).not.toHaveAttribute('aria-hidden')
  })
})

describe('props', () => {
  const { AddIcon, LoadingAIcon } = lib

  it('defaults to size 24 and currentColor without a root stroke', () => {
    const svg = getSvg(render(<AddIcon />).container)
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg).not.toHaveAttribute('stroke')
  })

  it('applies preset, numeric and string sizes', () => {
    expect(getSvg(render(<AddIcon size={48} />).container)).toHaveAttribute(
      'width',
      '48',
    )
    expect(getSvg(render(<AddIcon size={18} />).container)).toHaveAttribute(
      'height',
      '18',
    )
    expect(getSvg(render(<AddIcon size="2rem" />).container)).toHaveAttribute(
      'width',
      '2rem',
    )
  })

  it('applies color', () => {
    expect(getSvg(render(<AddIcon color="red" />).container)).toHaveAttribute(
      'fill',
      'red',
    )
  })

  it('gives the stroke-drawn LoadingAIcon a stroke matching color', () => {
    expect(getSvg(render(<LoadingAIcon />).container)).toHaveAttribute(
      'stroke',
      'currentColor',
    )
    expect(
      getSvg(render(<LoadingAIcon color="red" />).container),
    ).toHaveAttribute('stroke', 'red')
  })

  it('mirrors horizontally', () => {
    expect(getSvg(render(<AddIcon mirrored />).container)).toHaveAttribute(
      'transform',
      'scale(-1, 1)',
    )
    expect(getSvg(render(<AddIcon />).container)).not.toHaveAttribute(
      'transform',
    )
  })

  it('merges style with the default transition', () => {
    const svg = getSvg(render(<AddIcon style={{ opacity: 0.5 }} />).container)
    expect(svg.style.transition).toBe('all .15s')
    expect(svg.style.opacity).toBe('0.5')
  })

  it('lets style override the transition', () => {
    const svg = getSvg(
      render(<AddIcon style={{ transition: 'none' }} />).container,
    )
    expect(svg.style.transition).toBe('none')
  })
})

describe('StatusIcon', () => {
  const { StatusIcon } = lib
  const statuses = ['progress', 'error', 'success'] as const

  it.each(statuses)('renders %s without an undefined class', (status) => {
    const { container } = render(<StatusIcon status={status} />)
    const svg = getSvg(container)
    expect(svg).toHaveAccessibleName(`Icon for status ${status}`)
    expect(svg.getAttribute('class') ?? '').not.toContain('undefined')
  })

  it.each([
    ['error', Warning, 'var(--color-yellow, #fc0)'],
    ['success', CheckCircle, 'var(--color-green, #71dd8c)'],
  ] as const)(
    'renders %s as the filled Figma Toast icon in its token colour',
    (status, Glyph, color) => {
      const svg = getSvg(render(<StatusIcon status={status} />).container)
      const expected = getSvg(render(<Glyph weight="fill" />).container)

      expect(svg.innerHTML.replace(/<title>.*<\/title>/, '')).toBe(
        expected.innerHTML,
      )
      expect(svg.style.color).toBe(color)
      expect(svg).toHaveAttribute('fill', 'currentColor')
    },
  )

  it('lets style and color props override the status colour', () => {
    const styled = getSvg(
      render(<StatusIcon status="error" style={{ color: 'red' }} />).container,
    )
    expect(styled.style.color).toBe('red')

    const colored = getSvg(
      render(<StatusIcon status="success" color="blue" />).container,
    )
    expect(colored).toHaveAttribute('fill', 'blue')
  })

  it('appends a custom className', () => {
    const svg = getSvg(
      render(<StatusIcon status="success" className="custom" />).container,
    )
    expect(svg).toHaveClass('custom')
  })
})
