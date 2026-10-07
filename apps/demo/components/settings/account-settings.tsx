'use client'

import {
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tag,
  Typography,
  toast,
} from '@holakirr/snow-ui'
import Link from 'next/link'
import { type ReactNode, useEffect, useId, useState } from 'react'
import { usePreferences } from '@/app/providers'
import { BrandLogo } from '@/components/brand-logo'
import { ShieldCheckIcon } from '@/components/icons'
import { getSettingsCopy } from './settings-copy'
import { useSettingsData } from './settings-data'

const Panel = ({
  title,
  children,
  actions,
}: {
  title: string
  children: ReactNode
  actions?: ReactNode
}) => {
  const id = useId()
  return (
    <section aria-labelledby={id}>
      <Card variant="block" className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Typography asChild size={14} semibold>
            <h2 id={id}>{title}</h2>
          </Typography>
          {actions}
        </div>
        {children}
      </Card>
    </section>
  )
}

export const AccountSettings = () => {
  const { data, update } = useSettingsData()
  const { dict, lang, setLang } = usePreferences()
  const t = getSettingsCopy(lang)
  const [emails, setEmails] = useState(data.emails)
  const [notifications, setNotifications] = useState(data.notifications)
  useEffect(() => {
    setEmails(data.emails)
    setNotifications(data.notifications)
  }, [data.emails, data.notifications])
  const [skills, setSkills] = useState(['UX/UI', 'Product design'])
  const [confirm, setConfirm] = useState(false)
  const base = useId()
  const saved = () => toast({ status: 'success', title: dict.settings.saved })
  const actions = (save: () => void, cancel: () => void) => (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="gray" onClick={cancel}>
        {t.cancel}
      </Button>
      <Button
        size="sm"
        variant="filled"
        onClick={() => {
          save()
          saved()
        }}
      >
        {t.save}
      </Button>
    </div>
  )
  const field = (
    key: 'name' | 'lastName' | 'phone' | 'company' | 'website',
    title?: string,
  ) => (
    <Input
      name={key}
      title={title}
      aria-label={title ?? (key === 'name' ? t.firstName : t.lastName)}
      placeholder={key === 'name' ? t.firstName : t.lastName}
      value={data[key]}
      onChange={(event) => update({ [key]: event.target.value })}
      className={title ? 'h-22 px-5' : 'h-14 px-5'}
    />
  )
  const emailRows = [
    ['payments', t.payment, t.paymentHint],
    ['fees', t.fees, t.feesHint],
    ['disputes', t.disputes, t.disputesHint],
    ['refunds', t.refunds, t.refundsHint],
    ['invoices', t.invoices, t.invoicesHint],
    ['webhooks', t.webhooks, t.webhooksHint],
  ] as const
  const channels = [
    ['notifications', t.notifications],
    ['billing', t.billing],
    ['members', t.members],
    ['projects', t.projects],
    ['newsletters', t.newsletters],
  ] as const
  const connections = [
    [
      'SnowUI',
      'An advanced Dashboard / SaaS UI kit and design system for Figma.',
    ],
    ['Figma', 'The collaborative interface design tool.'],
    [
      'Twitter',
      'From breaking news and entertainment to sports and politics, get the full story with all the live commentary.',
    ],
    [
      'Instagram',
      'A simple, fun & creative way to capture, edit & share photos, videos & messages with friends & family.',
    ],
  ] as const
  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 md:gap-7 md:p-7">
      <Typography asChild size={14} className="sr-only">
        <h1>{dict.settings.title}</h1>
      </Typography>
      <div className="-mb-1 flex flex-wrap items-center justify-between gap-4">
        <nav
          aria-label={dict.settings.sections}
          className="flex flex-wrap gap-4 text-14"
        >
          <Link href="/dashboard" className="text-secondary focus-ring">
            {t.overview}
          </Link>
          <span
            aria-current="page"
            className="border-b-2 border-primary pb-0.5"
          >
            {t.settings}
          </span>
          <a href="#sign-in-method" className="text-secondary focus-ring">
            {t.security}
          </a>
          <a href="#email-preferences" className="text-secondary focus-ring">
            {t.billingTab}
          </a>
          {['Statements', 'Referrals', 'API Keys', 'Logs'].map((label) => (
            <button
              key={label}
              type="button"
              className="text-secondary focus-ring"
              onClick={() =>
                toast({
                  title: label,
                  description: dict.settings.savedDescription,
                })
              }
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="gray"
            onClick={() => toast({ title: t.follow })}
          >
            {t.follow}
          </Button>
          <Button
            size="sm"
            variant="gray"
            onClick={() => toast({ title: t.hire })}
          >
            {t.hire}
          </Button>
        </div>
      </div>
      <Panel title={t.profile}>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          {field('name')}
          {field('lastName')}
          {field('phone', t.phone)}
          <div className="flex h-19 flex-col justify-center gap-2 rounded-16 bg-surface-1 px-5 inset-ring-[0.5px] inset-ring-control-border">
            <Typography size={12} className="text-secondary">
              {t.skill}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Tag
                  key={skill}
                  label={skill}
                  state="active"
                  className="text-black"
                  onRemove={() =>
                    setSkills((current) =>
                      current.filter((item) => item !== skill),
                    )
                  }
                />
              ))}
            </div>
          </div>
          {field('company', t.company)}
          {field('website', t.website)}
          <Select
            value={data.country}
            onValueChange={(country) => update({ country })}
          >
            <SelectTrigger
              title={t.country}
              aria-label={t.country}
              className="h-22 px-5"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(dict.countries).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={lang}
            onValueChange={(value) => {
              if (value === 'en' || value === 'ru') setLang(value)
            }}
          >
            <SelectTrigger
              title={t.language}
              aria-label={t.language}
              className="h-22 px-5"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(dict.languages).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex h-22 flex-col justify-center gap-2 rounded-16 bg-surface-1 px-5 inset-ring-[0.5px] inset-ring-control-border sm:col-span-2">
            <Typography size={12} className="text-secondary">
              {t.status}
            </Typography>
            <Label className="flex items-center gap-2 text-12 text-secondary">
              <Switch
                checked={data.active}
                onCheckedChange={(active) => update({ active })}
              />
              {t.active}
            </Label>
          </div>
        </div>
      </Panel>
      <div id="sign-in-method">
        <Panel title={t.signIn}>
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              title={t.email}
              value={data.email}
              type="email"
              onChange={(event) => update({ email: event.target.value })}
              className="h-22 px-5"
            />
            <Input
              title={t.password}
              defaultValue="snowui-password"
              type="password"
              readOnly
              className="h-22 px-5"
            />
          </div>
          <div className="flex items-start gap-2 rounded-16 bg-surface-1 p-4 md:min-h-21">
            <ShieldCheckIcon size={20} aria-hidden />
            <div className="min-w-0 flex-1">
              <Typography size={14} className="block">
                {t.secure}
              </Typography>
              <p className="max-w-176 text-12 text-secondary">{t.secureHint}</p>
            </div>
            <Button
              size="sm"
              variant="gray"
              aria-pressed={data.twoFactor}
              onClick={() => update({ twoFactor: !data.twoFactor })}
            >
              {data.twoFactor ? t.disable : t.enable}
            </Button>
          </div>
        </Panel>
      </div>
      <Panel title={t.connected}>
        <div className="flex gap-2 rounded-16 bg-surface-1 p-4 text-12 text-secondary md:min-h-16">
          <ShieldCheckIcon size={20} aria-hidden />
          <p>{t.connectedHint}</p>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          {connections.map(([key, description], index) => (
            <div
              key={key}
              className={`relative flex items-start gap-4 ${index < 2 ? 'pb-4 after:absolute after:inset-x-0 after:bottom-0 after:h-[0.5px] after:bg-black-10' : ''}`}
            >
              <span className="flex h-9 w-11 shrink-0 items-center justify-center">
                <BrandLogo name={key} size={32} />
              </span>
              <div className="min-w-0 flex-1">
                <Typography size={14} semibold className="block">
                  {key}
                </Typography>
                <p className="truncate text-12 text-secondary">{description}</p>
              </div>
              <Switch
                aria-label={key}
                className="mx-3 mt-2.5"
                checked={data.connected[key]}
                onCheckedChange={(checked) =>
                  update({ connected: { ...data.connected, [key]: checked } })
                }
              />
            </div>
          ))}
        </div>
      </Panel>
      <div id="email-preferences">
        <Panel
          title={t.emails}
          actions={actions(
            () => update({ emails }),
            () => setEmails(data.emails),
          )}
        >
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            {emailRows.map(([key, title, description]) => (
              <label
                htmlFor={`${base}-email-${key}`}
                key={key}
                className="relative flex items-start gap-4 px-3 pb-4 text-14 after:absolute after:inset-x-0 after:bottom-0 after:h-[0.5px] after:bg-black-10"
              >
                <Checkbox
                  id={`${base}-email-${key}`}
                  className="relative size-5 rounded-6 hit-area"
                  checked={emails[key]}
                  onCheckedChange={(checked) =>
                    setEmails((current) => ({
                      ...current,
                      [key]: checked === true,
                    }))
                  }
                />
                <div className="min-w-0 flex-1">
                  <Typography size={14} semibold className="block">
                    {title}
                  </Typography>
                  <p className="truncate text-12 text-secondary">
                    {description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </Panel>
      </div>
      <Panel
        title={t.notifications}
        actions={actions(
          () => update({ notifications }),
          () => setNotifications(data.notifications),
        )}
      >
        <div className="flex flex-col gap-4">
          {channels.map(([key, title], rowIndex) => (
            <div
              key={key}
              className={`relative flex flex-wrap items-start justify-between gap-4 ${rowIndex < 4 ? 'pb-4 after:absolute after:inset-x-0 after:bottom-0 after:h-[0.5px] after:bg-black-10' : ''}`}
            >
              <Typography size={14}>{title}</Typography>
              <div className="flex gap-6 px-3">
                {[t.emailChannel, t.phoneChannel].map((channel, index) => (
                  <label
                    htmlFor={`${base}-${key}-${index}`}
                    key={channel}
                    className="flex items-center gap-2 text-14"
                  >
                    <Checkbox
                      id={`${base}-${key}-${index}`}
                      className="relative size-5 rounded-6 hit-area"
                      aria-label={`${title}: ${channel}`}
                      checked={notifications[key][index]}
                      onCheckedChange={(checked) =>
                        setNotifications((current) => ({
                          ...current,
                          [key]: current[key].map((value, i) =>
                            i === index ? checked === true : value,
                          ),
                        }))
                      }
                    />
                    {channel}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel
        title={t.deactivate}
        actions={
          <Button
            size="sm"
            variant="filled"
            className="bg-red-text text-white"
            disabled={!confirm}
            onClick={() => {
              update({ active: false })
              saved()
            }}
          >
            {t.deactivate}
          </Button>
        }
      >
        <div className="flex gap-2 rounded-16 bg-surface-1 p-4">
          <ShieldCheckIcon size={20} aria-hidden />
          <div>
            <Typography size={14} className="block">
              {t.deactivateHint}
            </Typography>
            <p className="text-12 text-secondary">{t.deactivateDescription}</p>
          </div>
        </div>
        <label
          htmlFor={`${base}-confirm`}
          className="flex items-center gap-2 text-14"
        >
          <Checkbox
            id={`${base}-confirm`}
            className="relative size-5 rounded-6 hit-area"
            checked={confirm}
            onCheckedChange={(checked) => setConfirm(checked === true)}
          />
          {t.confirm}
        </label>
      </Panel>
      <footer className="-mx-4 -mt-4 -mb-4 flex flex-wrap items-center justify-between gap-4 px-4 py-5 text-12 text-secondary md:-mx-7 md:-mt-7 md:-mb-7 md:px-7">
        <span>© 2026 SnowUI</span>
        <nav aria-label="Footer" className="flex gap-4">
          <a
            href="https://github.com/holakirr/snow-ui#readme"
            className="focus-ring"
          >
            About
          </a>
          <Link href="/preferences" className="focus-ring">
            Support
          </Link>
          <a
            href="https://github.com/holakirr/snow-ui/issues"
            className="focus-ring"
          >
            Contact Us
          </a>
        </nav>
      </footer>
    </div>
  )
}
