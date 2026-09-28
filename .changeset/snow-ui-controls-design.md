---
"@holakirr/snow-ui": major
---

Align the controls with the SnowUI Figma kit: Button, Link, Tag, Badge, KBD, Input (Input, InputSmall, Textarea, Checkbox, RadioGroup, Switch, Select, Slider, Toggle, ToggleGroup), Label, Form, Tabs, Tooltip, Popover, DropdownMenu and ContextMenu. They use the design tokens (`black-10`, `rounded-16`, `text-14`, `shadow-glass-2`…) instead of Tailwind's alpha modifiers and off-scale radii, and render the Figma variants in both light and dark mode. Where the kit conflicts with WCAG 2.2 AA, the components follow WCAG; see "Accessibility deviations from the Figma kit" in the README.

**Breaking changes and how to migrate**

- `Input`:
  - The title no longer floats. `title` renders the Figma "2 row" title: a static 12/16 label in Black/40% above the value, and the `placeholder` stays visible next to it.
  - `Input` renders a field element around the `<input>`. `className` and `style` now apply to that field (it holds the stroke, background, padding and width); use the new `inputClassName` and `inputStyle` for the `<input>` itself. `ref`, `id`, `value`, event handlers and every other prop still go to the `<input>`.
  - The field is full width, 44px high with one row and 68px with a title (padding 12/16, 14/20 text, a 0.5px stroke), instead of 16/20 padding and 18px text.

  ```tsx
  // Before
  <Input title="Email" className="w-80 uppercase" style={{ letterSpacing: 1 }} />
  // After
  <Input title="Email" className="w-80" inputClassName="uppercase" inputStyle={{ letterSpacing: 1 }} />
  ```

- `focusInputClasses` no longer sets a font size (it had `text-lg`; `basicInputClasses` now sets `text-14`) and uses the `focus-ring` utility instead of `focus:ring-4 focus:ring-focus`.
- `Button`:
  - Labels don't wrap (`whitespace-nowrap`).
  - The Figma icon sizes (12/16/20px next to a label, 16/20/24px icon-only) apply only to `<svg>` children that don't size themselves (no `width` attribute and no `size-*` class). Icons from `@holakirr/snow-ui-icons` always render `width`, so they keep their `size` (24 by default): pass `size={16}` and so on to match the design.
- `Link`: the `arrow` and `external` variants are `inline-flex` (the default variant stays inline, so it wraps in prose). `external` links open in a new tab by default (`target="_blank"`, `rel="noopener noreferrer"`; pass your own to override) and append a visually hidden "(opens in a new tab)" (`externalLabel` to translate it).
- `Tag`: the root is `inline-flex` (was `flex`), and the close control is a plain `<button>` (was a `Button`) with a 12px icon and a 24px hit area.

**Accessibility deviations from the Figma kit**

- Focus: every control shows the new `focus-ring` utility on keyboard focus — the Figma "Focus" ring plus a 2px `black-80` outline offset by 2px (12.6:1 in light mode, 8.7:1 in dark mode; the Figma ring alone is 1.1:1). Inactive tabs, off toggles and Bare buttons, which are at 40% opacity, turn fully opaque while focused.
- The Filled Button label and the checked Checkbox mark use the per-mode `white` token: black on the dark-mode indigo Primary (10.15:1) instead of Figma's white (2.07:1).
- The Badge number is black on indigo (10.15:1) instead of white (2.07:1).
- Indigo text (the default Link, the active Tag) uses the new `indigo-text` token: `#5B5BD6` in light mode (5.37:1 on white) and the Figma `#ADADFB` in dark mode (6.11:1). Fills keep the Figma indigo.
- The default Link underlines on hover as well as changing colour.
- The Dark Tooltip's text flips with its background in dark mode.
- An icon-only `TabsTrigger` without `aria-label` or `aria-labelledby` logs a warning in development.

**New**

- The `focus-ring` utility and the `indigo-text` colour token (`text-indigo-text`).
- `Input`: `startContent` and `endContent` for icons, buttons or a `KBD` around the value; `readOnly` renders the Figma "Static" state (no hover or focus stroke); `inputClassName` and `inputStyle`.
- `Button`: `variant="bare"` (no box, 40% opacity, 100% on hover).
- `Tabs`: `TabsList` takes `variant` (`line`, the default; `pill`; `icon-toggle`; `solid`) and `size` (`sm`, `md`, `lg`); `TabsTrigger` takes an `icon` (a trigger with only an icon is an icon-only tab).
- `ToggleGroup` / `Toggle`: `variant="pill"`, and `iconOnly` for square icon toggles (detected when omitted: a single child element without children, such as an icon). Toggles now look like the Tabs segmented items, and `ToggleGroupItem` props override the group's.
- `Checkbox` renders the indeterminate state (`checked="indeterminate"`, Figma "Multiple") with a bar.
- `Tag`: `state` (`default`, `active`, `static`), `shape` (`default`, `arrow-left`, `arrow-right`) and `dot`.
- `TooltipContent`: `variant="light"`; `TooltipShortcut` for the 40% secondary text.
- `KBD`: `variant` (`solid`, the default; `border`).
- `Link`: `variant` (`default`, `arrow`, `external`) and `externalLabel`.
- `Textarea` and `InputSmall` support the "Static" state through `readOnly`.
- Exports: `LinkProps`, `linkVariants`, `kbdVariants`, `tooltipVariants`, `ToggleVariantProps`, `staticInputClasses`, `TabsVariant`, `TagState`, `TagShape`. `BUTTON_VARIANTS` and `TOGGLE_VARIANTS` include `bare` and `pill`.
- `@radix-ui/react-compose-refs` is a direct dependency.

**Visual changes**

- `Button`: the Figma sizes — `sm` 24px (padding 4/12, radius 12, 12/16 text), `md` 36px (8/16, radius 16, 14/20), `lg` 48px (12/20, radius 20, 16/24). The label size follows the button size (it was always 16px; `textSize` still overrides it). Gray is Black/4% (10% on hover), Borderless and Outline hover to Black/4%, Outline has a 0.5px stroke, Filled hovers to `primary-hover`. Disabled buttons use Black/20% text.
- `Checkbox`, `RadioGroup`: 2px Black/20% rings on Background/3, Black/40% on hover, the Figma check mark, and the Figma inner shadow on the checked fill; the checkbox radius is 8px. `Switch`: the thumb travels 12px, stays white in dark mode and has "Drop shadow 2". Disabled controls are at 40% opacity.
- `Tabs` (`line`): a 2px underline; inactive tabs are at 40% opacity and 100% on hover.
- `Tooltip`: a 12px radius, a background blur and a White/10% overlay.
- `PopoverContent`, `DropdownMenuContent`, `ContextMenuContent`, `SelectContent`: 12px padding, Background/3, a 1px Surface/1 stroke and the "Glass 2" shadow. Their items are 36px high with a 12px radius; group labels are 12/16 Black/40%; separators are 0.5px Black/10%; shortcuts use `KBD`.
- `SelectTrigger`: the Input field (44px, 14/20 text) with a 16px icon.
- `InputSmall`: the Figma Search field (radius 16, 0.5px stroke, background blur).
- `Tag`: a 12px close icon at 40% opacity without a button background.
- `Badge`: indigo (was purple).
- `KBD`: a 16px-high box (28px minimum width, radius 6) with 12/16 text in Black/100% (was Black/20% text without a box).
- `Link`: 14/20 text; the default link is indigo (was 12px Black/40%).
- `Label`, `FormDescription`, `FormMessage`: 12/16 text; the label is Black/40% and no longer `w-min`.
- `SidebarInput` renders the new Input field, 32px high.
