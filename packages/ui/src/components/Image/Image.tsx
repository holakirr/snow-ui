import type { ComponentProps, FC } from 'react'
import { RadioMark, type RadioMarkSize } from '../../utils/radio-mark'
import { twMerge } from '../../utils/tw-merge'

/**
 * Sizes of the Figma "Image" (px), or `free` for a size you set with a
 * class.
 */
export type ImageSize =
  | 12
  | 16
  | 20
  | 24
  | 28
  | 32
  | 40
  | 48
  | 56
  | 64
  | 72
  | 80
  | 'free'

type SizeSpec = {
  /** The frame's size and corner radius (the kit's, 4 to 20). */
  frame: string
  /** `icon`: the inset around the content, and the content's radius. */
  icon: string
  /** The option mark's diameter and its inset from the top end corner. */
  mark: [RadioMarkSize, string]
}

// The corners are the kit's squircle where the browser supports
// `corner-shape` (a rounded square elsewhere), with the radius tokens. The
// icon inset and the mark sizes are measured on the components overview
// (the raw Figma data doesn't have them); the radii are read from the kit's
// Image instances.
const sizeSpecs: { [K in ImageSize]: SizeSpec } = {
  12: {
    frame: 'size-3 rounded-4',
    icon: 'p-0.5 *:rounded-4',
    mark: [8, 'top-0 end-0'],
  },
  16: {
    frame: 'size-4 rounded-4',
    icon: 'p-0.5 *:rounded-4',
    mark: [8, 'top-0 end-0'],
  },
  20: {
    frame: 'size-5 rounded-4',
    icon: 'p-0.5 *:rounded-4',
    mark: [10, 'top-0 end-0'],
  },
  24: {
    frame: 'size-6 rounded-8',
    icon: 'p-1 *:rounded-4',
    mark: [10, 'top-0.5 end-0.5'],
  },
  28: {
    frame: 'size-7 rounded-8',
    icon: 'p-1 *:rounded-4',
    mark: [12, 'top-0.5 end-0.5'],
  },
  32: {
    frame: 'size-8 rounded-8',
    icon: 'p-1 *:rounded-4',
    mark: [12, 'top-1 end-1'],
  },
  40: {
    frame: 'size-10 rounded-12',
    icon: 'p-1.5 *:rounded-8',
    mark: [12, 'top-1 end-1'],
  },
  48: {
    frame: 'size-12 rounded-12',
    icon: 'p-2 *:rounded-8',
    mark: [16, 'top-1 end-1'],
  },
  56: {
    frame: 'size-14 rounded-16',
    icon: 'p-2 *:rounded-8',
    mark: [16, 'top-1.5 end-1.5'],
  },
  64: {
    frame: 'size-16 rounded-20',
    icon: 'p-2.5 *:rounded-12',
    mark: [20, 'top-1.5 end-1.5'],
  },
  72: {
    frame: 'size-18 rounded-20',
    icon: 'p-3 *:rounded-12',
    mark: [20, 'top-2 end-2'],
  },
  80: {
    frame: 'size-20 rounded-20',
    icon: 'p-3 *:rounded-16',
    mark: [20, 'top-2 end-2'],
  },
  free: {
    frame: 'rounded-20',
    icon: 'p-3 *:rounded-12',
    mark: [20, 'top-2 end-2'],
  },
}

/**
 * Props for the Image component.
 */
export type ImageProps = ComponentProps<'span'> & {
  /**
   * The size (px), or `free` for a size you set with a class
   * (`className="h-24 w-40"`).
   * @default 40
   */
  size?: ImageSize

  /**
   * The Figma `Icon` image: the content (an icon, a logo) sits inset on a
   * Black/4% tile instead of filling the frame.
   * @default false
   */
  icon?: boolean

  /**
   * The Figma `State=Hover` on hover (a darker top edge) and a pointer
   * cursor, for an image the user can pick. Make the element that handles
   * the pick a control (a `<button>`, a `role="radio"`) with a name.
   * @default false
   */
  interactive?: boolean

  /**
   * The Figma `State=Selected`: the option mark is checked (with `option`),
   * or a 2px Primary ring shows it. Also sets `data-state="selected"`.
   * @default false
   */
  selected?: boolean

  /**
   * The Figma `Option`: a selection mark (the kit's RadioAlt) on the top
   * end corner, checked when `selected`.
   * @default false
   */
  option?: boolean
}

/**
 * Image frames a picture, a logo or an icon as the kit's rounded square
 * (the Figma "Image"): 12 to 80px or `free`, with an optional selection
 * mark (`option`) and the hover and selected states of an image picker. Pass
 * the `<img>` (or a framework image, a `<picture>`, an icon) as children:
 * it is stretched to the frame and cropped to its corners. Unlike `Avatar`,
 * which is round and shows initials while loading, Image is a square frame.
 */
const Image: FC<ImageProps> = ({
  size = 40,
  icon = false,
  interactive = false,
  selected = false,
  option = false,
  className,
  children,
  ...props
}) => {
  const spec = sizeSpecs[size]
  const [markSize, markInset] = spec.mark

  return (
    <span
      data-size={size}
      data-state={selected ? 'selected' : undefined}
      className={twMerge(
        'group/image relative inline-flex shrink-0 overflow-hidden bg-black-4 align-middle [corner-shape:squircle]',
        spec.frame,
        interactive &&
          // Figma "Image hover": an inner shadow over the top edge.
          'cursor-pointer after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:transition-shadow hover:after:shadow-[inset_0_20px_20px_0_rgb(0_0_0/0.1)] motion-reduce:after:transition-none',
        selected &&
          !option &&
          'before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:inset-ring-2 before:inset-ring-primary',
        className,
      )}
      {...props}
    >
      {/* The content fills the frame (or, `icon`, the inset tile) and is
          cropped to its corners; so does the `<img>` of a `<picture>`. */}
      <span
        data-slot="image-content"
        className={twMerge(
          'flex size-full items-center justify-center *:size-full *:shrink-0 *:object-cover [&>picture]:overflow-hidden [&>picture>img]:size-full [&>picture>img]:object-cover',
          icon && spec.icon,
        )}
      >
        {children}
      </span>
      {option && (
        <RadioMark
          host="image"
          checked={selected}
          size={markSize}
          className={twMerge('absolute z-20', markInset)}
        />
      )}
    </span>
  )
}
Image.displayName = 'Image'

export { Image }
