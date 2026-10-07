import {
  Card,
  IconBox,
  IconText,
  Separator,
  Typography,
} from '@holakirr/snow-ui'
import type { Metadata } from 'next'
import NextLink from 'next/link'
import { BrandLogo } from '@/components/brand-logo'
import { BrandWordmark } from '@/components/brand-wordmark'
import { SignUpButton, SocialButtons } from '@/components/sign-in/demo-actions'
import { SignInForm } from '@/components/sign-in/sign-in-form'
import { getRequestPreferences } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getRequestPreferences()
  return { title: dict.signIn.title }
}

/**
 * The kit's authentication page: the logo, the title, social sign-in, the
 * email / password form and the links. A Server Component around the client
 * form (react-hook-form + zod).
 */
export default async function SignInPage() {
  const { dict } = await getRequestPreferences()
  const t = dict.signIn

  return (
    <div className="relative flex min-h-svh flex-col bg-background-2">
      <header className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 px-4 py-4 md:px-7">
        <IconText
          asChild
          interactive
          className="gap-1.5 p-0"
          icon={
            <IconBox size={28} aria-hidden className="text-black">
              <BrandLogo name="SnowUI" size={28} />
            </IconBox>
          }
        >
          <NextLink href="/dashboard">
            <BrandWordmark width={71} height={12} />
          </NextLink>
        </IconText>
        <nav
          aria-label={dict.nav.main}
          className="hidden items-center gap-10 text-12 md:flex"
        >
          {Object.entries(t.navigation).map(([key, label]) => (
            <a
              key={key}
              className="rounded-4 focus-ring"
              href={
                key === 'download'
                  ? 'https://github.com/holakirr/snow-ui/releases'
                  : key === 'pricing'
                    ? 'https://github.com/holakirr/snow-ui/blob/main/LICENSE'
                    : `https://github.com/holakirr/snow-ui#${key === 'product' ? 'readme' : key === 'solutions' ? 'packages' : 'development'}`
              }
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-12">
          <span className="rounded-16 bg-black-4 px-3 py-1">
            <SignUpButton />
          </span>
          <a
            href="#content"
            className="rounded-16 bg-primary px-3 py-1 text-white focus-ring"
          >
            {t.title}
          </a>
        </div>
      </header>

      <main
        id="content"
        className="flex min-h-svh flex-1 items-center justify-center px-4 py-20 md:py-10"
      >
        <Card
          variant="block"
          className="flex w-full max-w-170 flex-col items-center gap-7 rounded-24 bg-background-1 px-6 py-12 md:py-26 [&>div]:w-full [&>div]:max-w-96"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Typography asChild size={24} semibold>
              <h1>{t.title}</h1>
            </Typography>
            <Typography size={14} className="text-secondary">
              {t.subtitle}
            </Typography>
          </div>

          <SocialButtons />

          <div className="flex items-center gap-3">
            <Separator decorative className="flex-1" />
            <Typography size={14} className="text-secondary">
              {t.or}
            </Typography>
            <Separator decorative className="flex-1" />
          </div>

          <div className="w-full max-w-96">
            <SignInForm />
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="flex flex-wrap items-center justify-center gap-1 text-14 text-secondary">
              {t.noAccount} <SignUpButton />
            </p>
          </div>
        </Card>
      </main>
      <footer className="absolute inset-x-0 bottom-6 px-4 text-center text-12 text-secondary">
        © 2026 SnowUI
      </footer>
    </div>
  )
}
