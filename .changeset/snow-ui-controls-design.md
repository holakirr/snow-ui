---
"@holakirr/snow-ui": major
---

Align the controls with the SnowUI Figma kit: Button, Link, Tag, Badge, KBD, Input (Input, InputSmall, Textarea, Checkbox, RadioGroup, Switch, Select, Slider, Toggle, ToggleGroup), Label, Form, Tabs, Tooltip, Popover, DropdownMenu and ContextMenu. They use the design tokens (`black-10`, `rounded-16`, `text-14`, `ring-focus`, `shadow-glass-2`…) instead of Tailwind's alpha modifiers and off-scale radii, and render the Figma variants in both light and dark mode.

**Breaking: `Input`**

- The title no longer floats. `title` renders the Figma "2 row" title: a static 12/16 label in Black/40% above the value, and the `placeholder` stays visible next to it.
- `Input` renders a field element around the `<input>`. `className` now styles that field (it's where the border, background, padding and width are); use the new `inputClassName` for the `<input>` itself. `ref`, `id`, `value`, event handlers and every other prop still go to the `<input>`.
- The field is full width, 44px high with one row and 68px with a title (padding 12/16, 14/20 text, a 0.5px stroke), instead of 16/20 padding and 18px text.

```tsx
// Before
<Input title="Email" className="w-80 uppercase" />
// After
<Input title="Email" className="w-80" inputClassName="uppercase" />
```

**New**

- `Input`: `startContent` and `endContent` for icons, buttons or a `KBD` around the value; `readOnly` renders the Figma "Static" state (no hover or focus stroke).
- `Button`: `variant="bare"` (no box, 40% opacity, 100% on hover).
- `Tabs`: `TabsList` takes `variant` (`line`, the default; `pill`; `icon-toggle`; `solid`) and `size` (`sm`, `md`, `lg`); `TabsTrigger` takes an `icon` (a trigger with only an icon is an icon-only tab).
- `ToggleGroup` / `Toggle`: `variant="pill"`. Toggles now look like the Tabs segmented items.
- `Checkbox` renders the indeterminate state (`checked="indeterminate"`, Figma "Multiple") with a bar.
- `Tag`: `state` (`default`, `active`, `static`), `shape` (`default`, `arrow-left`, `arrow-right`) and `dot`.
- `TooltipContent`: `variant="light"`; `TooltipShortcut` for the 40% secondary text.
- `KBD`: `variant` (`solid`, the default; `border`).
- `Link`: `variant` (`default`, `arrow`, `external`).
- `Textarea` and `InputSmall` support the "Static" state through `readOnly`.
- Exports: `LinkProps`, `linkVariants`, `kbdVariants`, `tooltipVariants`, `ToggleVariantProps`, `staticInputClasses`, `TabsVariant`, `TagState`, `TagShape`. `BUTTON_VARIANTS` and `TOGGLE_VARIANTS` include `bare` and `pill`.

**Visual changes**

- `Button`: the Figma sizes — `sm` 24px (padding 4/12, radius 12, 12/16 text), `md` 36px (8/16, radius 16, 14/20), `lg` 48px (12/20, radius 20, 16/24) — with 12/16/20px icons next to a label and 16/20/24px icons in icon-only buttons. The label size follows the button size (it was always 16px; `textSize` still overrides it). Gray is Black/4% (10% on hover), Borderless and Outline hover to Black/4%, Outline has a 0.5px stroke, Filled hovers to `primary-hover` and keeps a white label in dark mode. Focus shows `ring-focus` on keyboard focus only; disabled buttons use Black/20% text.
- `Checkbox`, `RadioGroup`: 2px Black/20% rings on Background/3, Black/40% on hover, the Figma check mark, and the Figma inner shadow on the checked fill; the checkbox radius is 8px. `Switch`: the thumb travels 12px, stays white in dark mode and has "Drop shadow 2". Disabled controls are at 40% opacity.
- `Tabs` (`line`): a 2px underline; inactive tabs are at 40% opacity and 100% on hover.
- `Tooltip`: a 12px radius, a background blur and a White/10% overlay.
- `PopoverContent`, `DropdownMenuContent`, `ContextMenuContent`, `SelectContent`: 12px padding, Background/3, a 1px Surface/1 stroke and the "Glass 2" shadow. Their items are 36px high with a 12px radius; group labels are 12/16 Black/40%; separators are 0.5px Black/10%; shortcuts use `KBD`.
- `SelectTrigger`: the Input field (44px, 14/20 text) with a 16px icon.
- `InputSmall`: the Figma Search field (radius 16, 0.5px stroke, background blur).
- `Tag`: a 12px close icon at 40% opacity without a button background.
- `Badge`: indigo with a white number (was purple with black text).
- `KBD`: a 16px-high box (28px minimum width, radius 6) with 12/16 text in Black/100% (was Black/20% text without a box).
- `Link`: 14/20 text; the default link is indigo (was 12px Black/40%).
- `Label`, `FormDescription`, `FormMessage`: 12/16 text; the label is Black/40% and no longer `w-min`.
- `SidebarInput` renders the new Input field, 32px high.
