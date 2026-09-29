# @holakirr/snow-ui-icons

SnowUI Icons is a React icons library implementation of icons from [SnowUI design kit](https://snowui.byewind.com) by [ByeWind](https://byewind.com/). Implemented and improved by [holakirr](https://github.com/holakirr).
Build your design using [it](https://www.figma.com/community/file/1301134685302006646). The best experience you will get using it with [@holakirr/snow-ui](https://www.npmjs.com/package/@holakirr/snow-ui)

[Storybook](https://snow-ui.holakirr.com) (shared with `@holakirr/snow-ui`, under "Icons")

Take a look at my [CV](https://holakirr.com) =)

## Features

- 🎨 49 icons ready to use
- 📚 Storybook for component documentation and development
- 🔍 TypeScript for type safety
- ✅ Unit tests with Vitest + Testing Library
- 🌲 Tree-shakeable ESM (one module per icon) plus CommonJS build
- 🚀 tsdown (Rolldown) library build, checked with publint and are-the-types-wrong
- ⚡️ Powered by Bun for fast package management and running scripts

## Usage

Just import the icon you need and use it in your component.

```bash
bun add @holakirr/snow-ui-icons
```

```jsx
import {
	SnowUIIcon,
	LoadingAIcon,
	FourLeafCloverIcon,
	StarIcon,
	StatusIcon,
} from '@holakirr/snow-ui-icons'

const App = () => {
	return (
		<main>
			<SnowUIIcon alt="SnowUI" />
			<LoadingAIcon color="#AE2983" size={32} />
			<FourLeafCloverIcon color="teal" weight="duotone" />
			<StarIcon weight="fill" size="2rem" />
			<StatusIcon status="success" />
		</main>
	)
}
```

### Props

Icon components accept all props that you can pass to a normal SVG element, including inline style objects, onClick handlers, and more. The main way of styling them will usually be with the following props:

- color?: string – Icon color (applied as `fill`; the stroke-drawn `LoadingAIcon` also uses it for `stroke`). Can be any CSS color string, including hex, rgb, rgba, hsl, hsla, named colors, or the special currentColor variable. Defaults to `currentColor`. The multicolour file icons (`DocXIcon`, `NotepadIcon`…) keep their own colours; `SnowUIIcon` (the logo) draws its bars in `color`, with the snowflake cut out, so it shows the background behind it.
- size?: `IconSize` | number | string – Icon height & width, default `24`. Presets (`16 | 20 | 24 | 28 | 32 | 40 | 48 | 80`, also exported as `ICON_SIZES`) are suggested by autocomplete, but any number (px) or CSS length string (`"2rem"`, `"100%"`, ...) is accepted.
- weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone" – Icon weight/style (see `ICON_WEIGHTS`). Can also be used, for example, to "toggle" an icon's state: a rating component could use `StarIcon` with weight="regular" to denote an empty star, and weight="fill" to denote a filled star. Not every icon defines every weight — see [Supported weights](#supported-weights).
- mirrored?: boolean – Flip the icon horizontally. Can be useful in RTL languages where normal icon orientation is not appropriate.
- alt?: string – Add accessible alt text to an icon.

### Supported weights

Icons fall back to `regular` when the requested weight is not defined, so any weight is safe to pass, but only these icons actually change:

| Weights | Icons |
| --- | --- |
| all six (`thin`, `light`, `regular`, `bold`, `fill`, `duotone`) | `ArrowLineDownIcon`, `ArrowLineLeftIcon`, `ArrowLineRightIcon`, `ArrowLineUpIcon`, `ClipboardIcon`, `CopyIcon`, `DefaultIcon`, `FourLeafCloverIcon`, `XCircleIcon` |
| `regular`, `fill` | `DotIcon`, `RectangleIcon`, `StarIcon` |
| `regular` only | `AIIcon`, `AddIcon`, `ArrowFallIcon`, `ArrowLineUpDownIcon`, `ArrowRightIcon`, `ArrowRiseIcon`, `ArrowsDownIcon`, `ArrowsDownUpIcon`, `ArrowsUpIcon`, `CloseIcon`, `DocXIcon`, `DotsThreeOutlineHorizontalIcon`, `ExplainIcon`, `FormIcon`, `FourPointedStarIcon`, `GotoIcon`, `HelpIcon`, `HorizontalScreenIcon`, `LineIcon`, `LoadingAIcon`, `LoadingBIcon`, `MaximizeIcon`, `MinimizeIcon`, `NotepadIcon`, `OneNoteIcon`, `PPTIcon`, `RightBarIcon`, `RoundedCornerIcon`, `SearchIcon`, `SnowUIIcon`, `StopIcon`, `TXTIcon`, `TextAIcon`, `VariablesIcon`, `VerticalScreenIcon`, `WindowedIcon`, `XLSXIcon` |

### StatusIcon

`<StatusIcon status="progress" | "error" | "success" />` renders `LoadingAIcon`, or the filled `Warning` / `CheckCircle` icons from [Phosphor](https://phosphoricons.com), the icons of the SnowUI Figma Toast. Those two Phosphor icons are bundled into this package (under `dist/vendor`), so you don't need to install `@phosphor-icons/react`, and nothing else from Phosphor is shipped. `error` is Secondary/Yellow and `success` Secondary/Green (`var(--color-yellow, #fc0)` / `var(--color-green, #71dd8c)`: the `@holakirr/snow-ui` tokens, with the Figma values as fallbacks); a `color` prop wins. The colours are meant for dark surfaces like the toast and don't reach 3:1 on white.

### Composability

Components can accept arbitrary SVG elements as children, so long as they are valid children of the `<svg>` element. This can be used to modify an icon with background layers or shapes, filters, animations, and more. The children will be placed below the normal icon contents. The root `<svg>` sets `fill` (from `color`) but no `stroke`, so give stroked children their own `stroke`.

### Imports

The package ships ESM with one module per icon and `"sideEffects": false`, plus a CommonJS build for `require()`. With named imports, modern bundlers (Vite/Rollup, webpack 5, esbuild) include only the icons you use — a single icon costs about 1 kB minified. A namespace import works too; bundlers still tree-shake the members you access, as long as you don't pass the whole namespace object around dynamically.

```jsx
import * as Icon from "@holakirr/snow-ui-icons";

<Icon.StarIcon />
<Icon.SearchIcon color="teal" />
<Icon.CloseIcon size={32} />
```

### Custom Icons

It is possible to extend SnowUI Icons with your custom icons, taking advantage of the styling abstractions used in our library. To create a custom icon, first design your icons on a 32×32 pixel grid, and export them as SVG. For best results, flatten the icon so that you only export assets with `path` elements. Strip any `fill` attributes, as the color is inherited from the wrapper (`fill={color}`). The wrapper sets no `stroke`, so stroke-based shapes should set `stroke` themselves.

Next, create a new React component, importing the `IconBase` component, as well as the `Icon` and `IconWeight` types from this library. Define a `Map<IconWeight, ReactElement>` that maps each icon weight to the contents of each SVG asset, effectively removing the wrapping `<svg>` element from each. Name your component, and render an `<IconBase />`, passing all props (in React 19 `ref` is a regular prop, so no `forwardRef` is needed), as well as the `weights` you defined earlier, as JSX props:

```tsx
import type { ReactElement } from "react";
import { IconBase, type Icon, type IconWeight } from "@holakirr/snow-ui-icons";

const weights = new Map<IconWeight, ReactElement>([
  ["thin", <path d="..." />],
  ["light", <path d="..." />],
  ["regular", <path d="..." />],
  ["bold", <path d="..." />],
  ["fill", <path d="..." />],
  [
    "duotone",
    <>
      <path d="..." opacity="0.2" />
      <path d="..." />
    </>,
  ],
]);

const CustomIcon: Icon = (props) => <IconBase {...props} weights={weights} />;

export default CustomIcon;
```

## Related project

[Holakirr Snow UI](https://www.npmjs.com/package/@holakirr/snow-ui) — developed alongside this package in the same repository ([`packages/ui`](https://github.com/holakirr/snow-ui/tree/main/packages/ui)).

## Development

This package lives in the [snow-ui monorepo](https://github.com/holakirr/snow-ui) under `packages/icons` (previously `holakirr/snow-ui-icons`). Install dependencies and run scripts from the repository root — see the [root README](https://github.com/holakirr/snow-ui#readme). Package-only scripts: `bun run --filter @holakirr/snow-ui-icons <build|test|typecheck>`. Icon stories are part of the shared Storybook at the repository root (`bun run storybook`).

## License

MIT
