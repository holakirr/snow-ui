import Image from 'next/image'

/** Original vector artwork exported from the kit's Logos resource page. */
export type Brand =
  | 'Apple'
  | 'Google'
  | 'Figma'
  | 'Twitter'
  | 'Instagram'
  | 'Slack'
  | 'SnowUI'
  | 'Visa'
  | 'Mastercard'
  | 'PayPal'

export const BrandLogo = ({
  name,
  size = 24,
}: {
  name: Brand
  size?: number
}) => (
  <Image
    src={`/logos/${name === 'SnowUI' ? 'snowlogo' : name.toLowerCase()}.svg`}
    alt=""
    aria-hidden
    width={size}
    height={size}
    unoptimized
    className={
      name === 'Visa'
        ? 'shrink-0 brightness-0 dark:invert'
        : name === 'Apple'
          ? 'shrink-0 dark:invert'
          : 'shrink-0'
    }
  />
)
