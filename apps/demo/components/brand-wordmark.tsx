import Image from 'next/image'

/** Original SnowUI wordmark, scaled from its 51×9 vector frame. */
export const BrandWordmark = ({
  width = 51,
  height = 9,
}: {
  width?: number
  height?: number
}) => (
  <Image
    src="/logos/snow-wordmark.svg"
    alt="SnowUI"
    width={width}
    height={height}
    style={{ width, height }}
    unoptimized
    className="shrink-0 dark:brightness-0 dark:invert"
  />
)
