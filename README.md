# SnowUI

SnowUI is a React UI of mostly (!) "stupid" (with no state or effect, you'll have to provide it by yourself) components library implementation of [SnowUI design kit](https://snowui.byewind.com) by [ByeWind](https://byewind.com/). Implemented and improved by [holakirr](https://github.com/holakirr). Based on TailwindCSS.
Build your design using [it](https://www.figma.com/community/file/1301134685302006646)

[Beta build of storybook](https://snowui.holakirr.com)

Take a look at my [CV](https://holakirr.com) =)

## How to install

### 1. Install my library

```bash
npm add holakirr-snow-ui
# or
yarn add holakirr-snow-ui
# or
pnpm add holakirr-snow-ui
# or
bun add holakirr-snow-ui
```

### 2. Add to your global css file

```css
@import "holakirr-snow-ui/index.css";
```

### 3. Import any component in your project

```ts
import { Button } from "holakirr-snow-ui";
```

### 3. You're good to go =)

## How to develop

### Clone repo

### Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Test lib in storybook

One of these commands will start tests:

> [!WARNING]
> Make sure you have storybook running

```bash
npm run test
# or
yarn test
# or
pnpm test
# or
bun test
```

### Builds

One of these commands will compile project in 'dist' directory

```bash
npm run build-lib
# or
yarn build-lib
# or
pnpm build-lib
# or
bun build-lib
```

One of these commands will compile storybook in 'storybook-static' directory

```bash
npm run build-storybook
# or
yarn build-storybook
# or
pnpm build-storybook
# or
bun build-storybook
```
