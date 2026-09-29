'use client'

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  IconBox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Typography,
  toast,
} from '@holakirr/snow-ui'
import { type FormEvent, useId, useRef, useState } from 'react'
import { useDictionary } from '@/app/providers'
import { UploadSimpleIcon } from '@/components/icons'
import { InitialsAvatar } from '@/components/initials-avatar'
import { SaveButton, SettingsSection } from './section'

const USERNAME = /^\w{3,20}$/
const BIO_MAX = 160

type Errors = Partial<Record<'name' | 'username' | 'bio', string>>

/**
 * The profile tab with the library-agnostic `Form*` components: plain React
 * state and a hand-written check on submit, passed to `FormItem error`.
 */
export const ProfileForm = () => {
  const dict = useDictionary()
  const t = dict.settings.profile
  const [errors, setErrors] = useState<Errors>({})
  const [bio, setBio] = useState('Product designer. Building dashboards.')
  const [country, setCountry] = useState('us')
  const [file, setFile] = useState<string>()
  const fileInput = useRef<HTMLInputElement>(null)
  const avatarHintId = useId()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const username = String(data.get('username') ?? '').trim()
    const next: Errors = {
      name: name ? undefined : t.nameRequired,
      username: USERNAME.test(username) ? undefined : t.usernameInvalid,
      bio: bio.length > BIO_MAX ? t.bioTooLong : undefined,
    }
    setErrors(next)
    const invalid = Object.entries(next).find(([, message]) => message)
    if (invalid) {
      event.currentTarget
        .querySelector<HTMLElement>(`[name="${invalid[0]}"]`)
        ?.focus()
      toast({ status: 'error', title: dict.settings.fixErrors })
      return
    }
    toast({
      status: 'success',
      title: dict.settings.saved,
      description: dict.settings.savedDescription,
    })
  }

  return (
    <SettingsSection id="profile-heading" title={t.heading}>
      <Form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <InitialsAvatar name={dict.app.user} size={80} />
          <div className="flex flex-col gap-2">
            <Typography size={14} semibold>
              {t.avatar}
            </Typography>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(event) => {
                  const chosen = event.target.files?.[0]
                  if (chosen) setFile(chosen.name)
                }}
              />
              <Button
                variant="outline"
                size="md"
                label={t.upload}
                aria-describedby={avatarHintId}
                startContent={
                  <IconBox size={16} aria-hidden>
                    <UploadSimpleIcon />
                  </IconBox>
                }
                onClick={() => fileInput.current?.click()}
              />
              <Button
                variant="borderless"
                size="md"
                label={t.remove}
                disabled={!file}
                onClick={() => {
                  setFile(undefined)
                  if (fileInput.current) fileInput.current.value = ''
                }}
              />
            </div>
            <Typography
              id={avatarHintId}
              size={12}
              className="text-secondary"
              role="status"
            >
              {file ? t.avatarChosen(file) : t.avatarHint}
            </Typography>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormItem error={errors.name}>
            <FormControl>
              <Input
                name="name"
                title={t.name}
                autoComplete="name"
                defaultValue="ByeWind"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem error={errors.username}>
            <FormControl>
              <Input
                name="username"
                title={t.username}
                autoComplete="username"
                defaultValue="byewind"
              />
            </FormControl>
            <FormDescription>{t.usernameHint}</FormDescription>
            <FormMessage />
          </FormItem>
        </div>

        <FormItem error={errors.bio}>
          <FormLabel>{t.bio}</FormLabel>
          <FormControl>
            <Textarea
              name="bio"
              rows={3}
              placeholder={t.bioPlaceholder}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </FormControl>
          <FormDescription>{t.bioHint(bio.length)}</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>{t.country}</FormLabel>
          <Select name="country" value={country} onValueChange={setCountry}>
            <FormControl>
              <SelectTrigger className="sm:max-w-80">
                <SelectValue placeholder={t.countryPlaceholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(dict.countries).map(([code, label]) => (
                <SelectItem key={code} value={code}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        <SaveButton label={dict.settings.save} />
      </Form>
    </SettingsSection>
  )
}
