/** Original 80×48 ThemeSelection rectangles from the SnowUI source. */
export const ThemePreview = ({
  value,
  selected,
}: {
  value: 'system' | 'light' | 'dark'
  selected: boolean
}) => (
  <svg
    aria-hidden
    width={80}
    height={48}
    viewBox="0 0 80 48"
    className={`rounded-4 ${value === 'dark' ? 'bg-black' : 'bg-background-2'} ${selected ? 'inset-ring-2 inset-ring-indigo-text' : 'inset-ring-[0.5px] inset-ring-black-10'}`}
  >
    {[
      [25, 28, 51, 16],
      [28, 35, 20, 2],
      [28, 39, 16, 2],
      [25, 15, 51, 11],
      [28, 31, 27, 2],
      [4, 4, 19, 40],
      [25, 4, 51, 9],
    ].map(([x, y, width, height], index) => (
      <rect
        key={`${x}-${y}`}
        x={x}
        y={y}
        width={width}
        height={height}
        rx={2}
        fill={
          value === 'system' && index === 5
            ? 'var(--color-black-80)'
            : value === 'dark'
              ? 'var(--color-white-20)'
              : 'var(--color-black-4)'
        }
      />
    ))}
  </svg>
)
