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
      const regular = getSvg(render(<Icon />).container).innerHTML
      for (const weight of Object.values(lib.ICON_WEIGHTS)) {
        const html = getSvg(
          render(<Icon weight={weight} />).container,
        ).innerHTML
        if (weights.has(weight)) expect(html.length).toBeGreaterThan(0)
        else expect(html).toBe(regular)
      }
    },
  )

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
