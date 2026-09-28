# @holakirr/snow-ui-icons

SnowUI Icons is a React icons library implementation of icons from [SnowUI design kit](https://snowui.byewind.com) by [ByeWind](https://byewind.com/). Implemented and improved by [holakirr](https://github.com/holakirr).
Build your design using [it](https://www.figma.com/community/file/1301134685302006646). The best experience you will get using it with [@holakirr/snow-ui](https://www.npmjs.com/package/@holakirr/snow-ui)

[Storybook](https://snow-ui-icons.holakirr.com)

Take a look at my [CV](https://holakirr.com) =)

## Features

- 🎨 49 icons ready to use
- 📚 Storybook for component documentation and development
- 🔍 TypeScript for type safety
- ✅ Comprehensive testing setup with chromatic
- 🚀 Vite for fast development and building
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
	StatusIcon,
} from '@holakirr/snow-ui-icons'

const App = () => {
	return (
		<main>
			<SnowUIIcon alt="SnowUI" />
			<LoadingAIcon color="#AE2983" weight="fill" size={32} />
			<FourLeafCloverIcon color="teal" weight="duotone" />
			<StatusIcon status="success" />
		</main>
	)
}
```

### Props

Icon components accept all props that you can pass to a normal SVG element, including inline style objects, onClick handlers, and more. The main way of styling them will usually be with the following props:

- color?: string – Icon stroke/fill color. Can be any CSS color string, including hex, rgb, rgba, hsl, hsla, named colors, or the special currentColor variable.
- size?: number | string – Icon height & width. As with standard React elements, this can be a number, or a string with units in px, %, em, rem, pt, cm, mm, in.
- weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone" – Icon weight/style. Can also be used, for example, to "toggle" an icon's state: a rating component could use Stars with weight="regular" to denote an empty star, and weight="fill" to denote a filled star.
- mirrored?: boolean – Flip the icon horizontally. Can be useful in RTL languages where normal icon orientation is not appropriate.
- alt?: string – Add accessible alt text to an icon.

### Composability

Components can accept arbitrary SVG elements as children, so long as they are valid children of the `<svg>` element. This can be used to modify an icon with background layers or shapes, filters, animations, and more. The children will be placed below the normal icon contents.

### Imports

You may wish to import all icons at once for use in your project, though depending on your bundler this could prevent tree-shaking and make your app's bundle larger.

```jsx
import * as Icon from "@holakirr/snow-ui-icons";

<Icon.StarIcon />
<Icon.SearchIcon color="teal" />
<Icon.CloseIcon size={32} />
```

### Custom Icons

It is possible to extend SnowUI Icons with your custom icons, taking advantage of the styling abstractions used in our library. To create a custom icon, first design your icons on a 32×32 pixel grid, and export them as SVG. For best results, flatten the icon so that you only export assets with `path` elements. Strip any `fill` or `stroke` attributes, as these will be inherited from the wrapper.

Next, create a new React component, importing the `IconBase` component, as well as the `Icon` and `IconWeight` types from this library. Define a `Map<IconWeight, ReactElement>` that maps each icon weight to the contents of each SVG asset, effectively removing the wrapping `<svg>` element from each. Name your component, and render an `<IconBase />`, passing all props and the ref, as well as the `weights` you defined earlier, as JSX props:

```jsx
import { forwardRef, ReactElement } from "react";
import { Icon, IconBase, IconWeight } from "@holakirr/snow-ui-icons";

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

const CustomIcon: Icon = forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

CustomIcon.displayName = "CustomIcon";

export default CustomIcon;
```

## Related project

[Holakirr Snow UI](https://www.npmjs.com/package/@holakirr/snow-ui)

## License

MIT
