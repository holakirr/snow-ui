import {
  Card,
  Group,
  IconBox,
  IconText,
  Link,
  Separator,
  Typography,
} from '@holakirr/snow-ui'
import { SnowUIIcon } from '@holakirr/snow-ui-icons'
import type { Metadata } from 'next'
import NextLink from 'next/link'
import {
  DirectionToggle,
  LanguageMenu,
  ThemeMenu,
} from '@/components/shell/preference-controls'
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
    <div className="flex min-h-svh flex-col bg-background-1">
      <header className="flex items-center justify-between gap-4 px-4 py-4 md:px-7 md:py-5">
        <IconText
          asChild
          interactive
          icon={
            <IconBox size={24} aria-hidden className="dark:invert">
              <SnowUIIcon />
            </IconBox>
          }
        >
          <NextLink href="/dashboard">
            <Typography size={16} semibold>
              {dict.app.brand}
            </Typography>
          </NextLink>
        </IconText>
        <Group aria-label={dict.header.tools}>
          <ThemeMenu />
          <LanguageMenu />
          <DirectionToggle />
        </Group>
      </header>

      <main
        id="content"
        className="flex flex-1 items-center justify-center px-4 pb-10"
      >
        <Card
          variant="block"
          className="flex w-full max-w-110 flex-col gap-6 p-6 md:p-10"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <IconBox size={48} aria-hidden className="dark:invert">
              <SnowUIIcon />
            </IconBox>
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
            <Typography size={12} className="text-secondary">
              {t.or}
            </Typography>
            <Separator decorative className="flex-1" />
          </div>

          <SignInForm />

          <div className="flex flex-col items-center gap-3">
            <p className="flex flex-wrap items-center justify-center gap-1 text-14 text-secondary">
              {t.noAccount} <SignUpButton />
            </p>
            <Link asChild className="text-14">
              <NextLink href="/dashboard">{t.backToDashboard}</NextLink>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  )
}
