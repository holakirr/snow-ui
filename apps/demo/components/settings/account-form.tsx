'use client'

import {
  Button,
  Checkbox,
  Form,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Typography,
  toast,
} from '@holakirr/snow-ui'
import { useId } from 'react'
import { useDictionary } from '@/app/providers'
import { SaveButton, SettingsSection } from './section'

/** The account tab: email, time zone, 2FA (Switch), sessions (Checkbox). */
export const AccountForm = () => {
  const dict = useDictionary()
  const t = dict.settings.account
  const ids = {
    timezone: useId(),
    twoFactor: useId(),
    twoFactorHint: useId(),
    sessions: useId(),
    deleteHint: useId(),
  }

  return (
    <SettingsSection id="account-heading" title={t.heading}>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          toast({
            status: 'success',
            title: dict.settings.saved,
            description: dict.settings.savedDescription,
          })
        }}
        className="flex flex-col gap-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="email"
            type="email"
            title={t.email}
            autoComplete="email"
            defaultValue="byewind@example.com"
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor={ids.timezone}>{t.timezone}</Label>
            <Select name="timezone" defaultValue="berlin">
              <SelectTrigger id={ids.timezone}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dict.timezones).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor={ids.twoFactor} className="text-14 text-black">
              {t.twoFactor}
            </Label>
            <Typography
              id={ids.twoFactorHint}
              size={12}
              className="text-secondary"
            >
              {t.twoFactorHint}
            </Typography>
          </div>
          <Switch
            id={ids.twoFactor}
            name="twoFactor"
            defaultChecked
            aria-describedby={ids.twoFactorHint}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id={ids.sessions} name="sessions" defaultChecked />
          <Label htmlFor={ids.sessions} className="text-14 text-black">
            {t.sessions}
          </Label>
        </div>

        <SaveButton label={dict.settings.save} />

        <Separator decorative />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Typography asChild size={14} semibold>
              <h3>{t.dangerZone}</h3>
            </Typography>
            <Typography
              id={ids.deleteHint}
              size={12}
              className="text-secondary"
            >
              {t.deleteHint}
            </Typography>
          </div>
          <Button
            variant="outline"
            size="md"
            label={t.deleteAccount}
            disabled
            aria-describedby={ids.deleteHint}
          />
        </div>
      </Form>
    </SettingsSection>
  )
}
