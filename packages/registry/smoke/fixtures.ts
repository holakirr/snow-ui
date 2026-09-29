/*
 * Fixtures of the smoke test.
 *
 * `SHADCN_REGISTRY`: the two files `shadcn init <url>` reads from shadcn's
 * own registry even for a base item with `extends: "none"` (the list of
 * styles and the base colour, unused without `cssVars`). The smoke test
 * serves them locally (`REGISTRY_URL`), so it doesn't depend on
 * ui.shadcn.com, which answers automated requests with Vercel's bot
 * checkpoint at times.
 *
 * `SHADCN_PROJECT`: the shadcn/ui files of an existing project (radix-nova,
 * as `shadcn init` and `shadcn add button card` write them, trimmed to what
 * the test needs), for the `next-shadcn` app.
 */

export const SHADCN_REGISTRY: Record<string, unknown> = {
  'styles/index.json': [{ name: 'radix-nova', label: 'Radix Nova' }],
  'colors/neutral.json': {
    inlineColors: { light: {}, dark: {} },
    cssVars: { light: {}, dark: {} },
    inlineColorsTemplate: '',
    cssVarsTemplate: '',
  },
}

export const SHADCN_PROJECT_DEPENDENCIES = [
  '@radix-ui/react-slot',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
]

export const SHADCN_PROJECT: Record<string, string> = {
  'components.json': `${JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema.json',
      style: 'radix-nova',
      rsc: true,
      tsx: true,
      tailwind: {
        config: '',
        css: 'src/app/globals.css',
        baseColor: 'neutral',
        cssVariables: true,
        prefix: '',
      },
      iconLibrary: 'lucide',
      aliases: {
        components: '@/components',
        utils: '@/lib/utils',
        ui: '@/components/ui',
        lib: '@/lib',
        hooks: '@/hooks',
      },
    },
    null,
    2,
  )}\n`,
  'src/lib/utils.ts': `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
  'src/components/ui/button.tsx': `import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30',
      },
      size: { default: 'h-9 px-4 py-2', sm: 'h-8 px-3' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
`,
  'src/components/ui/card.tsx': `import type * as React from 'react'
import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Card }
`,
  'src/app/globals.css': `@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`,
}
