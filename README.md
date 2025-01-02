# Holakirr Snow UI

SnowUI is a React UI of mostly (!) "stupid" (with no state or effect, you'll have to provide it by yourself) components library implementation of [SnowUI design kit](https://snowui.byewind.com) by [ByeWind](https://byewind.com/). Implemented and improved by [holakirr](https://github.com/holakirr). Based on TailwindCSS.
Build your design using [it](https://www.figma.com/community/file/1301134685302006646)

[Beta build of storybook](https://snow-ui.holakirr.com)

Take a look at my [CV](https://holakirr.com) =)

## Features

- 🎨 Built with Tailwind CSS for utility-first styling
- 📚 Storybook for component documentation and development
- 🔍 TypeScript for type safety
- ✅ Comprehensive testing setup:
  - Unit testing with Vitest
  - E2E testing with Playwright
- 🚀 Vite for fast development and building
- ⚡️ Powered by Bun for fast package management and running scripts

## Getting Started

### Installation

To get started, install Holakirr Snow UI package via package manager of your choice:

```bash
bun add @holakirr/snow-ui
```

Then just import styles:

```jsx
import '@holakirr/snow-ui/styles.css'
```

### Basic example

Buttons are build using the Button component:

```jsx
import { Button } from '@holakirr/snow-ui';

function App() {
  return (
    <Button variant="filled" size="md">
      Click me
    </Button>
  );
```

## Component Documentation

Components are documented in Storybook with examples and props documentation. Visit the [Storybook](https://snow-ui.holakirr.com) to explore the components and their usage.

## Testing

- Unit tests are written using Vitest and React Testing Library
- E2E tests are written using Playwright
- All components have corresponding test files

## Usage

```bash
bun add @holakirr/snow-ui
```

```jsx
import { Button } from '@holakirr/snow-ui'

function App() {
	return (
		<Button variant="primary" size="md">
			Click me
		</Button>
	)
}
```

## License

MIT
