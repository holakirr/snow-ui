'use client'

import {
  Checkbox,
  Form,
  Label,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Switch,
  Typography,
  toast,
} from '@holakirr/snow-ui'
import { useId, useState } from 'react'
import { useDictionary } from '@/app/providers'
import { SaveButton, SettingsSection } from './section'

const EMAIL_KINDS = [
  'productUpdates',
  'securityAlerts',
  'weeklyDigest',
] as const

/** The notifications tab: RadioGroup, Checkboxes, Switch and Slider. */
export const NotificationsForm = () => {
  const dict = useDictionary()
  const t = dict.settings.notifications
  const [volume, setVolume] = useState([3])
  const baseId = useId()
  const id = (name: string) => `${baseId}-${name}`

  return (
    <SettingsSection id="notifications-heading" title={t.heading}>
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
        <fieldset className="flex flex-col gap-3">
          <Typography asChild size={14} semibold>
            <legend className="mb-3">{t.notifyAbout}</legend>
          </Typography>
          <RadioGroup name="notify" defaultValue="mentions">
            {(['all', 'mentions', 'none'] as const).map((value) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={id(`notify-${value}`)} />
                <Label
                  htmlFor={id(`notify-${value}`)}
                  className="text-14 text-black"
                >
                  {t[value]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <Typography asChild size={14} semibold>
            <legend className="mb-3">{t.emails}</legend>
          </Typography>
          {EMAIL_KINDS.map((kind) => (
            <div key={kind} className="flex items-center gap-2">
              <Checkbox
                id={id(kind)}
                name={kind}
                defaultChecked={kind !== 'weeklyDigest'}
              />
              <Label htmlFor={id(kind)} className="text-14 text-black">
                {t[kind]}
              </Label>
            </div>
          ))}
        </fieldset>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            {/* The thumb (role="slider") is named by aria-label below. */}
            <Typography size={14} aria-hidden>
              {t.volume}
            </Typography>
            <Typography
              size={14}
              className="text-secondary tabular-nums"
              aria-hidden
            >
              {volume[0]}
            </Typography>
          </div>
          <Slider
            name="volume"
            min={1}
            max={14}
            step={1}
            value={volume}
            onValueChange={setVolume}
            aria-label={t.volume}
          />
          <Typography size={12} className="text-secondary">
            {t.volumeHint(volume[0])}
          </Typography>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor={id('push')} className="text-14 text-black">
              {t.push}
            </Label>
            <Typography
              id={id('push-hint')}
              size={12}
              className="text-secondary"
            >
              {t.pushHint}
            </Typography>
          </div>
          <Switch
            id={id('push')}
            name="push"
            aria-describedby={id('push-hint')}
          />
        </div>

        <SaveButton label={dict.settings.save} />
      </Form>
    </SettingsSection>
  )
}
