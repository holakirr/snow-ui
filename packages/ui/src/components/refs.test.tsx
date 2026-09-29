import { fireEvent, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { beforeAll, describe, expect, it } from 'vitest'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './ContextMenu'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from './Dialog'
import {
  Checkbox,
  Select,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Toggle,
} from './Input'
import { Label } from './Label'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import { Separator } from './Separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
} from './Sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip'

// The components whose props type used to drop `ref` (so `<Checkbox ref>`
// didn't compile) pass it to the element the type says. The types themselves
// are checked against the build by test/types (`bun run test:dist`).

beforeAll(() => {
  // Radix measures thumbs and positions popovers with ResizeObserver, which
  // jsdom lacks.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

type Case = [
  name: string,
  element: (ref: (node: Element | null) => void) => ReactElement,
  type: typeof Element,
]

const cases: Case[] = [
  [
    'Accordion',
    (ref) => (
      <Accordion ref={ref} type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    HTMLDivElement,
  ],
  [
    'AccordionItem',
    (ref) => (
      <Accordion type="single">
        <AccordionItem ref={ref} value="a" />
      </Accordion>
    ),
    HTMLDivElement,
  ],
  [
    'AccordionTrigger',
    (ref) => (
      <Accordion type="single">
        <AccordionItem value="a">
          <AccordionTrigger ref={ref}>A</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    ),
    HTMLButtonElement,
  ],
  [
    'AccordionContent',
    (ref) => (
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionContent ref={ref}>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    HTMLDivElement,
  ],
  ['Checkbox', (ref) => <Checkbox ref={ref} />, HTMLButtonElement],
  ['Switch', (ref) => <Switch ref={ref} />, HTMLButtonElement],
  ['Slider', (ref) => <Slider ref={ref} />, HTMLSpanElement],
  ['Toggle', (ref) => <Toggle ref={ref}>B</Toggle>, HTMLButtonElement],
  [
    'SelectTrigger',
    (ref) => (
      <Select>
        <SelectTrigger ref={ref}>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
      </Select>
    ),
    HTMLButtonElement,
  ],
  ['Label', (ref) => <Label ref={ref}>Name</Label>, HTMLLabelElement],
  ['Separator', (ref) => <Separator ref={ref} />, HTMLDivElement],
  [
    'TabsList',
    (ref) => (
      <Tabs defaultValue="a">
        <TabsList ref={ref}>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>
    ),
    HTMLDivElement,
  ],
  [
    'TabsTrigger',
    (ref) => (
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger ref={ref} value="a">
            A
          </TabsTrigger>
        </TabsList>
      </Tabs>
    ),
    HTMLButtonElement,
  ],
  [
    'TabsContent',
    (ref) => (
      <Tabs defaultValue="a">
        <TabsContent ref={ref} value="a">
          A
        </TabsContent>
      </Tabs>
    ),
    HTMLDivElement,
  ],
  [
    'DialogContent',
    (ref) => (
      <Dialog open>
        <DialogContent ref={ref} aria-describedby={undefined}>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    ),
    HTMLDivElement,
  ],
  [
    'DialogOverlay',
    (ref) => (
      <Dialog open>
        <DialogPortal>
          <DialogOverlay ref={ref} />
        </DialogPortal>
      </Dialog>
    ),
    HTMLDivElement,
  ],
  [
    'SheetContent',
    (ref) => (
      <Sheet open>
        <SheetContent ref={ref} aria-describedby={undefined}>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    ),
    HTMLDivElement,
  ],
  [
    'SheetOverlay',
    (ref) => (
      <Sheet open>
        <SheetPortal>
          <SheetOverlay ref={ref} />
        </SheetPortal>
      </Sheet>
    ),
    HTMLDivElement,
  ],
  [
    'SheetTitle',
    (ref) => (
      <Sheet open>
        <SheetContent aria-describedby={undefined}>
          <SheetTitle ref={ref}>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    ),
    HTMLHeadingElement,
  ],
  [
    'SheetDescription',
    (ref) => (
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription ref={ref}>Text</SheetDescription>
        </SheetContent>
      </Sheet>
    ),
    HTMLParagraphElement,
  ],
  [
    'PopoverContent',
    (ref) => (
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref}>Content</PopoverContent>
      </Popover>
    ),
    HTMLDivElement,
  ],
  [
    'TooltipContent',
    (ref) => (
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Save</TooltipTrigger>
          <TooltipContent ref={ref}>Save the file</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    HTMLDivElement,
  ],
]

describe('ref', () => {
  it.each(cases)('%s forwards it to its element', (_, element, type) => {
    let node: Element | null = null
    render(
      element((current) => {
        node = current
      }),
    )

    expect(node).toBeInstanceOf(type)
  })

  it('reaches the ContextMenu parts', () => {
    const nodes: Record<string, Element | null> = {}
    const ref = (name: string) => (node: Element | null) => {
      nodes[name] = node
    }
    const { getByText } = render(
      <ContextMenu>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent ref={ref('content')}>
          <ContextMenuLabel ref={ref('label')}>Label</ContextMenuLabel>
          <ContextMenuItem ref={ref('item')}>Item</ContextMenuItem>
          <ContextMenuCheckboxItem ref={ref('checkbox')}>
            Check
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value="a">
            <ContextMenuRadioItem ref={ref('radio')} value="a">
              Radio
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator ref={ref('separator')} />
          <ContextMenuSub>
            <ContextMenuSubTrigger ref={ref('subTrigger')}>
              More
            </ContextMenuSubTrigger>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    )

    fireEvent.contextMenu(getByText('Area'))

    for (const name of [
      'content',
      'label',
      'item',
      'checkbox',
      'radio',
      'separator',
      'subTrigger',
    ]) {
      expect(nodes[name], name).toBeInstanceOf(HTMLDivElement)
    }
  })
})
