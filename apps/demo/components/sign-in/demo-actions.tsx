'use client'

import { Button, IconBox, toast } from '@holakirr/snow-ui'
import { useDictionary } from '@/app/providers'
import { BrandLogo } from '@/components/brand-logo'

/** "Sign in with Google / Apple": outline buttons that explain the demo. */
export const SocialButtons = () => {
  const t = useDictionary().signIn
  const providers = [
    { label: t.apple, icon: <BrandLogo name="Apple" size={20} /> },
    { label: t.google, icon: <BrandLogo name="Google" size={20} /> },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {providers.map(({ label, icon }) => (
        <Button
          key={label}
          variant="outline"
          size="lg"
          label={label}
          startContent={
            <IconBox size={20} aria-hidden>
              {icon}
            </IconBox>
          }
          className="h-10 min-h-10 w-full rounded-16 px-3 py-2 text-14"
          onClick={() => toast({ title: label, description: t.social })}
        />
      ))}
    </div>
  )
}

export const SignUpButton = () => {
  const t = useDictionary().signIn
  return (
    <Button
      variant="bare"
      label={t.signUp}
      textSize={14}
      className="[--button-fg:var(--color-black)]"
      onClick={() => toast({ title: t.signUp, description: t.signUpToast })}
    />
  )
}
