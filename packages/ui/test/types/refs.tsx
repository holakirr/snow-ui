// Type tests of the built declarations (dist/*.d.ts), compiled with `tsc` by
// test/types.test.ts (`bun run test:dist`). `@holakirr/snow-ui` resolves
// through the package's `exports`, as in an app. A failing check is a type
// error that names the component.

import * as ui from '@holakirr/snow-ui'
import * as rhf from '@holakirr/snow-ui/react-hook-form'
import { createRef, type JSXElementConstructor, type Ref } from 'react'
import { useForm } from 'react-hook-form'

type Exports = typeof ui

/** The exported components: capitalised exports that React can render. */
type ComponentName = {
  [K in keyof Exports]: K extends Capitalize<K>
    ? Exports[K] extends JSXElementConstructor<never>
      ? K
      : never
    : never
}[keyof Exports]

/**
 * The element each component's `ref` points at, or `null` when it renders no
 * element of its own (a Radix root, portal or sub-menu, a provider) and so
 * takes no ref. Every exported component must be listed.
 */
type RefTargets = {
  Accordion: HTMLDivElement
  AccordionContent: HTMLDivElement
  AccordionItem: HTMLDivElement
  AccordionTrigger: HTMLButtonElement
  Alert: HTMLDivElement
  AlertDescription: HTMLDivElement
  AlertDialog: null
  AlertDialogAction: HTMLButtonElement
  AlertDialogCancel: HTMLButtonElement
  AlertDialogContent: HTMLDivElement
  AlertDialogDescription: HTMLParagraphElement
  AlertDialogFooter: HTMLDivElement
  AlertDialogHeader: HTMLDivElement
  AlertDialogOverlay: HTMLDivElement
  AlertDialogPortal: null
  AlertDialogTitle: HTMLHeadingElement
  AlertDialogTrigger: HTMLButtonElement
  AlertTitle: HTMLDivElement
  Avatar: HTMLSpanElement
  AvatarFallback: HTMLSpanElement
  AvatarGroup: HTMLDivElement
  AvatarImage: HTMLImageElement
  Badge: HTMLDivElement
  BadgeComponent: HTMLSpanElement
  Breadcrumb: HTMLElement
  BreadcrumbEllipsis: HTMLSpanElement
  BreadcrumbItem: HTMLLIElement
  BreadcrumbLink: HTMLAnchorElement
  BreadcrumbList: HTMLOListElement
  BreadcrumbPage: HTMLSpanElement
  BreadcrumbSeparator: HTMLLIElement
  Button: HTMLButtonElement
  // react-day-picker's DayPicker takes no ref.
  Calendar: null
  Card: HTMLDivElement
  Checkbox: HTMLButtonElement
  Chip: HTMLSpanElement
  // A dialog with its own trigger: there is no single element to point at.
  // The <input role="combobox">, as react-hook-form needs to focus it.
  Combobox: HTMLInputElement
  CommandPalette: null
  ContextMenu: null
  ContextMenuCheckboxItem: HTMLDivElement
  ContextMenuContent: HTMLDivElement
  ContextMenuGroup: HTMLDivElement
  ContextMenuItem: HTMLDivElement
  ContextMenuLabel: HTMLDivElement
  ContextMenuPortal: null
  ContextMenuRadioGroup: HTMLDivElement
  ContextMenuRadioItem: HTMLDivElement
  ContextMenuSeparator: HTMLDivElement
  ContextMenuShortcut: HTMLElement
  ContextMenuSub: null
  ContextMenuSubContent: HTMLDivElement
  ContextMenuSubTrigger: HTMLDivElement
  ContextMenuTrigger: HTMLSpanElement
  // The trigger, a <button role="combobox">.
  DatePicker: HTMLButtonElement
  DateRangePicker: HTMLButtonElement
  Dialog: null
  DialogBody: HTMLDivElement
  DialogClose: HTMLButtonElement
  DialogContent: HTMLDivElement
  DialogDescription: HTMLParagraphElement
  DialogHeader: HTMLDivElement
  DialogOverlay: HTMLDivElement
  DialogPortal: null
  DialogTitle: HTMLHeadingElement
  DialogTrigger: HTMLButtonElement
  DropdownMenu: null
  DropdownMenuCheckboxItem: HTMLDivElement
  DropdownMenuContent: HTMLDivElement
  DropdownMenuGroup: HTMLDivElement
  DropdownMenuItem: HTMLDivElement
  DropdownMenuLabel: HTMLDivElement
  DropdownMenuPortal: null
  DropdownMenuRadioGroup: HTMLDivElement
  DropdownMenuRadioItem: HTMLDivElement
  DropdownMenuSeparator: HTMLDivElement
  DropdownMenuShortcut: HTMLElement
  DropdownMenuSub: null
  DropdownMenuSubContent: HTMLDivElement
  DropdownMenuSubTrigger: HTMLDivElement
  DropdownMenuTrigger: HTMLButtonElement
  Form: HTMLFormElement
  // A Slot: its only child.
  FormControl: HTMLElement
  FormDescription: HTMLParagraphElement
  FormFieldState: null
  FormItem: HTMLDivElement
  FormLabel: HTMLLabelElement
  FormMessage: HTMLParagraphElement
  Group: HTMLDivElement
  IconBox: HTMLSpanElement
  IconText: HTMLElement
  Input: HTMLInputElement
  InputSmall: HTMLInputElement
  KBD: HTMLElement
  Label: HTMLLabelElement
  Link: HTMLAnchorElement
  // Generic, so `ComponentProps` can't see its ref: see the JSX below.
  ListItem: 'jsx'
  // The <input role="combobox"> after the tags.
  MultiSelect: HTMLInputElement
  Pagination: HTMLElement
  PaginationContent: HTMLUListElement
  PaginationEllipsis: HTMLSpanElement
  PaginationItem: HTMLLIElement
  PaginationLink: HTMLAnchorElement
  PaginationNext: HTMLAnchorElement
  PaginationPrevious: HTMLAnchorElement
  Popover: null
  PopoverAnchor: HTMLDivElement
  PopoverContent: HTMLDivElement
  PopoverTrigger: HTMLButtonElement
  Progress: HTMLDivElement
  ProgressCircle: HTMLDivElement
  RadioGroup: HTMLDivElement
  RadioGroupItem: HTMLButtonElement
  Scheduler: HTMLDivElement
  Search: HTMLInputElement
  Select: null
  SelectContent: HTMLDivElement
  SelectGroup: HTMLDivElement
  SelectItem: HTMLDivElement
  SelectLabel: HTMLDivElement
  SelectScrollDownButton: HTMLDivElement
  SelectScrollUpButton: HTMLDivElement
  SelectSeparator: HTMLDivElement
  SelectTrigger: HTMLButtonElement
  SelectValue: HTMLSpanElement
  Separator: HTMLDivElement
  Sheet: null
  SheetClose: HTMLButtonElement
  SheetContent: HTMLDivElement
  SheetDescription: HTMLParagraphElement
  SheetFooter: HTMLDivElement
  SheetHeader: HTMLDivElement
  SheetOverlay: HTMLDivElement
  SheetPortal: null
  SheetTitle: HTMLHeadingElement
  SheetTrigger: HTMLButtonElement
  Sidebar: HTMLDivElement
  SidebarContent: HTMLDivElement
  SidebarFooter: HTMLDivElement
  SidebarGroup: HTMLDivElement
  SidebarGroupAction: HTMLButtonElement
  SidebarGroupContent: HTMLDivElement
  SidebarGroupLabel: HTMLDivElement
  SidebarHeader: HTMLDivElement
  SidebarInput: HTMLInputElement
  SidebarInset: HTMLElement
  SidebarMenu: HTMLUListElement
  SidebarMenuAction: HTMLButtonElement
  SidebarMenuBadge: HTMLDivElement
  SidebarMenuButton: HTMLButtonElement
  SidebarMenuItem: HTMLLIElement
  SidebarMenuSkeleton: HTMLDivElement
  SidebarMenuSub: HTMLUListElement
  SidebarMenuSubButton: HTMLAnchorElement
  SidebarMenuSubItem: HTMLLIElement
  SidebarProvider: HTMLDivElement
  SidebarRail: HTMLButtonElement
  SidebarSeparator: HTMLDivElement
  SidebarTrigger: HTMLElement
  Skeleton: HTMLDivElement
  Slider: HTMLSpanElement
  SnowUIProvider: null
  Spinner: HTMLSpanElement
  Strip: HTMLDivElement
  Switch: HTMLButtonElement
  Table: HTMLTableElement
  TableBody: HTMLTableSectionElement
  TableCaption: HTMLElement
  TableCell: HTMLTableCellElement
  TableFooter: HTMLTableSectionElement
  TableHead: HTMLTableCellElement
  TableHeader: HTMLTableSectionElement
  TableRow: HTMLTableRowElement
  Tabs: HTMLDivElement
  TabsContent: HTMLDivElement
  TabsList: HTMLDivElement
  TabsTrigger: HTMLButtonElement
  Tag: HTMLDivElement
  Textarea: HTMLTextAreaElement
  ThemeScope: HTMLDivElement
  Toast: HTMLLIElement
  ToastAction: HTMLButtonElement
  ToastClose: HTMLButtonElement
  ToastDescription: HTMLDivElement
  ToastProvider: null
  ToastTitle: HTMLDivElement
  ToastViewport: HTMLOListElement
  Toaster: null
  Toggle: HTMLButtonElement
  ToggleGroup: HTMLDivElement
  ToggleGroupItem: HTMLButtonElement
  Tooltip: null
  TooltipContent: HTMLDivElement
  TooltipProvider: null
  TooltipShortcut: HTMLSpanElement
  TooltipTrigger: HTMLButtonElement
  Typography: HTMLElement
}

/** A component's props (React's `ComponentProps`, for any component). */
type PropsOf<C> = C extends JSXElementConstructor<infer P> ? P : never

/** The type of a component's `ref` prop, `never` when it has none. */
type RefProp<C> = 'ref' extends keyof PropsOf<C> ? PropsOf<C>['ref'] : never

type IsAny<T> = 0 extends 1 & T ? true : false

type Check<K extends ComponentName> = K extends keyof RefTargets
  ? RefTargets[K] extends 'jsx' | 'unchecked'
    ? true
    : RefTargets[K] extends null
      ? [RefProp<Exports[K]>] extends [never]
        ? true
        : `${K} takes a ref: list the element it points at`
      : [RefProp<Exports[K]>] extends [never]
        ? `${K} has no \`ref\` prop`
        : IsAny<RefProp<Exports[K]>> extends true
          ? `${K}: \`ref\` is any`
          : Ref<RefTargets[K]> extends RefProp<Exports[K]>
            ? true
            : `${K}: \`ref\` doesn't take a ref to its element`
  : true

/** `true` when `T` is empty (`never`), otherwise `T`: the error lists it. */
type None<T> = [T] extends [never] ? true : T

/** Every exported component is listed in `RefTargets`… */
export const unlisted: None<Exclude<ComponentName, keyof RefTargets>> = true
/** …and every listed name is an exported component. */
export const notExported: None<Exclude<keyof RefTargets, ComponentName>> = true
/** Every component takes a ref to its element, or takes none. */
export const failed: None<
  Exclude<{ [K in ComponentName]: Check<K> }[ComponentName], true>
> = true

const button = createRef<HTMLButtonElement>()

/** The components whose `ref` was rejected in 5.0.0 (TS2322). */
export const regressions = (
  <>
    <ui.Checkbox ref={button} />
    <ui.Switch ref={button} />
    <ui.Select>
      <ui.SelectTrigger ref={button} />
    </ui.Select>
    <ui.Dialog>
      <ui.DialogContent ref={createRef<HTMLDivElement>()} />
    </ui.Dialog>
    <ui.Label ref={createRef<HTMLLabelElement>()} />
  </>
)

/** Generic components: the ref follows the rendered element. */
export const generic = (
  <>
    <ui.ListItem title="Title" ref={createRef<HTMLDivElement>()} />
    <ui.Button label="Save" ref={button} />
    <ui.Button asChild ref={createRef<HTMLAnchorElement>()}>
      <a href="/">Home</a>
    </ui.Button>
    <ui.Typography asChild ref={createRef<HTMLHeadingElement>()}>
      <h2>Title</h2>
    </ui.Typography>
  </>
)

/**
 * Pagination items: an `<a>` (as in 5.0) or, with a `page` and no `href`,
 * a `<button>`; the ref and the event follow the element.
 */
export const pagination = (
  <ui.Pagination onPageChange={() => {}}>
    <ui.PaginationLink
      href="?page=2"
      page={2}
      ref={(link) => void link?.href}
      onClick={(event) => event.currentTarget.href}
    >
      2
    </ui.PaginationLink>
    <ui.PaginationLink ref={createRef<HTMLAnchorElement>()}>
      3
    </ui.PaginationLink>
    <ui.PaginationLink
      page={4}
      ref={button}
      onClick={(event) => event.currentTarget.type}
    >
      4
    </ui.PaginationLink>
    <ui.PaginationNext page={5} ref={button} />
    {/* @ts-expect-error: a client-side item is a <button>, not an <a> */}
    <ui.PaginationLink page={6} ref={createRef<HTMLAnchorElement>()}>
      6
    </ui.PaginationLink>
  </ui.Pagination>
)

type Values = {
  name: string
  bio: string
  agree: boolean
  notify: boolean
  plan: string
  size: string
  volume: number[]
  fruit: string | null
  skills: string[]
  due: Date | null
  stay: ui.DateRange | null
}

/**
 * react-hook-form passes `field.ref` to the control, so it can focus the
 * first invalid field on submit: every form control takes it.
 */
export const ReactHookForm = () => {
  const form = useForm<Values>()

  return (
    <rhf.Form {...form}>
      <rhf.FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.Input {...field} />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.Textarea {...field} />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="agree"
        render={({ field: { ref, value, onChange, ...field } }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.Checkbox
                ref={ref}
                checked={value}
                onCheckedChange={onChange}
                {...field}
              />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="notify"
        render={({ field: { ref, value, onChange, ...field } }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.Switch
                ref={ref}
                checked={value}
                onCheckedChange={onChange}
                {...field}
              />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="plan"
        render={({ field: { ref, onChange, ...field } }) => (
          <rhf.FormItem>
            <ui.Select onValueChange={onChange} {...field}>
              <rhf.FormControl>
                <ui.SelectTrigger ref={ref}>
                  <ui.SelectValue />
                </ui.SelectTrigger>
              </rhf.FormControl>
            </ui.Select>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="size"
        render={({ field: { ref, onChange, ...field } }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.RadioGroup ref={ref} onValueChange={onChange} {...field} />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="volume"
        render={({ field: { ref, onChange, ...field } }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.Slider ref={ref} onValueChange={onChange} {...field} />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="fruit"
        render={({ field: { onChange, ...field } }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.Combobox options={[]} onValueChange={onChange} {...field} />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="skills"
        render={({ field: { onChange, ...field } }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.MultiSelect
                options={[]}
                onValueChange={onChange}
                {...field}
              />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="due"
        render={({ field: { onChange, ...field } }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.DatePicker onValueChange={onChange} {...field} />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
      <rhf.FormField
        control={form.control}
        name="stay"
        render={({ field: { onChange, ...field } }) => (
          <rhf.FormItem>
            <rhf.FormControl>
              <ui.DateRangePicker onValueChange={onChange} {...field} />
            </rhf.FormControl>
          </rhf.FormItem>
        )}
      />
    </rhf.Form>
  )
}
