import type { ComponentProps, FC, ReactNode } from 'react'
import { twMerge } from '../../utils/tw-merge'

/**
 * Sizes of the Figma "Icon" component (the size of the icon itself).
 */
export type IconBoxSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80

export const ICON_BOX_SIZES: { [K in IconBoxSize]: K } = {
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  40: 40,
  48: 48,
  80: 80,
}

type SizeSpec = {
  /** The icon slot: the icon, avatar or image is stretched to it. */
  icon: string
  /** `background`: padding and corner radius around the icon. */
  background: string
  /** The badge box. */
  badge: string
  /** Badge position without / with `background` (Figma offsets, px). */
  badgeOffset: [plain: string, withBackground: string]
  /**
   * `glass`, where the Figma Glass set differs from the main one: the tile's
   * padding and radius, and the badge position on it.
   */
  glass?: { background: string; badgeOffset: string }
}

// Figma "Icon" (set 33138:1011). With Background the box is
// 12→20, 16→24, 20→28, 24→32, 28→36, 32→40 (padding 4), 40→56, 48→64
// (padding 8) and 80→104 (padding 12); the Glass set (32973:289) has 80→88
// (padding 4, radius 24) and 24→32 like the main set. The Badge (a 16/20/24 Dot) sits on the
// top end corner (top right; top left in right-to-left text); its offset
// depends on the size and the background.
const sizeSpecs: { [K in IconBoxSize]: SizeSpec } = {
  12: {
    icon: 'size-3',
    background: 'p-1 rounded-8',
    badge: 'size-4',
    badgeOffset: ['-top-2 -end-2', '-top-1 -end-1'],
  },
  16: {
    icon: 'size-4',
    background: 'p-1 rounded-8',
    badge: 'size-4',
    badgeOffset: ['-top-2 -end-2', '-top-1 -end-1'],
  },
  20: {
    icon: 'size-5',
    background: 'p-1 rounded-8',
    badge: 'size-4',
    badgeOffset: ['top-[-7px] end-[-7px]', 'top-[-3px] end-[-3px]'],
  },
  24: {
    icon: 'size-6',
    background: 'p-1 rounded-12',
    badge: 'size-4',
    badgeOffset: ['top-[-6px] end-[-6px]', 'top-[-2px] end-[-2px]'],
  },
  28: {
    icon: 'size-7',
    background: 'p-1 rounded-12',
    badge: 'size-4',
    badgeOffset: ['top-[-5px] end-[-5px]', 'top-[-1px] end-[-1px]'],
  },
  32: {
    icon: 'size-8',
    background: 'p-1 rounded-12',
    badge: 'size-4',
    badgeOffset: ['-top-1 -end-1', 'top-0 end-0'],
  },
  40: {
    icon: 'size-10',
    background: 'p-2 rounded-16',
    badge: 'size-4',
    badgeOffset: ['top-[-3px] end-[-3px]', 'top-[5px] end-[5px]'],
  },
  48: {
    icon: 'size-12',
    background: 'p-2 rounded-20',
    badge: 'size-5',
    badgeOffset: ['top-[-2px] end-[-2px]', 'top-[6px] end-[6px]'],
  },
  80: {
    icon: 'size-20',
    background: 'p-3 rounded-28',
    badge: 'size-6',
    badgeOffset: ['top-[2px] end-[2px]', 'top-[14px] end-[14px]'],
    glass: { background: 'p-1 rounded-24', badgeOffset: 'top-[6px] end-[6px]' },
  },
}

/**
 * Props for the IconBox component.
 */
export type IconBoxProps = ComponentProps<'span'> & {
  /**
   * The size of the icon (px). The icon, avatar or image passed as children
   * is stretched to it.
   * @default 24
   */
  size?: IconBoxSize

  /**
   * Put the icon on a Black/4% tile with the Figma padding and corner radius
   * for its size. Override the colour with `className` (e.g. `bg-color-1`).
   * @default false
   */
  background?: boolean

  /**
   * The Figma `Glass` tile: the icon on White/20% with the "Glass 1" effect
   * (the `glass-1` utility: a background blur and a soft shadow) instead of
   * Black/4%, for icons over a picture or a colour. Implies `background`.
   * @default false
   */
  glass?: boolean

  /**
   * Show a badge on the top end corner (top right; top left in right-to-left
   * text): `true` renders the Figma dot, any other node (e.g. a `<Badge>`
   * with a count) is centred on the same spot.
   */
  badge?: boolean | ReactNode

  /**
   * Accessible text for the badge, e.g. "Unread notifications". Without it the
   * badge is decorative.
   */
  badgeLabel?: string
}

/**
 * IconBox sets the size of an icon, avatar or image and can put it on a tile
 * (`background`) and add a `badge` — the Figma "Icon" component.
 */
const IconBox: FC<IconBoxProps> = ({
  size = ICON_BOX_SIZES[24],
  background = false,
  glass = false,
  badge,
  badgeLabel,
  className,
  children,
  ...props
}) => {
  const spec = sizeSpecs[size]
  const hasBadge = badge !== undefined && badge !== false && badge !== null
  const tile = background || glass
  const tileSpec = (glass && spec.glass) || {
    background: spec.background,
    badgeOffset: spec.badgeOffset[1],
  }

  return (
    <span
      data-size={size}
      data-glass={glass || undefined}
      className={twMerge(
        'relative inline-flex size-fit shrink-0 items-center justify-center',
        tile && [glass ? 'glass-1' : 'bg-black-4', tileSpec.background],
        className,
      )}
      {...props}
    >
      <span
        className={twMerge(
          'flex shrink-0 items-center justify-center *:size-full *:shrink-0',
          spec.icon,
        )}
      >
        {children}
      </span>
      {hasBadge && (
        <span
          data-slot="badge"
          aria-hidden={badgeLabel ? undefined : true}
          className={twMerge(
            'absolute flex items-center justify-center',
            spec.badge,
            tile ? tileSpec.badgeOffset : spec.badgeOffset[0],
          )}
        >
          {badge === true ? (
            <span className="size-[37.5%] rounded-full bg-indigo" />
          ) : (
            badge
          )}
          {badgeLabel && <span className="sr-only">{badgeLabel}</span>}
        </span>
      )}
    </span>
  )
}
IconBox.displayName = 'IconBox'

export { IconBox }
