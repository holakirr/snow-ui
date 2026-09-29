'use client'

import { Button, IconBox, toast } from '@holakirr/snow-ui'
import { useDictionary } from '@/app/providers'
import { AppleLogoIcon, GoogleLogoIcon } from '@/components/icons'

/** "Sign in with Google / Apple": outline buttons that explain the demo. */
export const SocialButtons = () => {
  const t = useDictionary().signIn
  const providers = [
    { label: t.google, icon: <GoogleLogoIcon weight="bold" /> },
    { label: t.apple, icon: <AppleLogoIcon weight="fill" /> },
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {providers.map(({ label, icon }) => (
        <Button
          key={label}
          variant="outline"
          size="md"
          label={label}
          startContent={
            <IconBox size={20} aria-hidden>
              {icon}
            </IconBox>
          }
          className="w-full"
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
      className="text-black underline-offset-4 hover:underline"
      onClick={() => toast({ title: t.signUp, description: t.signUpToast })}
    />
  )
}
