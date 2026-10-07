'use client'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Typography,
  toast,
} from '@holakirr/snow-ui'
import { ArrowLineRightIcon, CloseIcon } from '@holakirr/snow-ui-icons'
import Link from 'next/link'
import { Fragment, type ReactNode, useId, useState } from 'react'
import { usePreferences } from '@/app/providers'
import { BrandLogo } from '@/components/brand-logo'
import {
  BellIcon,
  CheckIcon,
  CurrencyCircleDollarIcon,
  DotsThreeIcon,
  GearSixIcon,
  HandPalmIcon,
  PaletteIcon,
  PlugsConnectedIcon,
  PlusIcon,
  SunHorizonIcon,
  TextAaIcon,
} from '@/components/icons'
import { InitialsAvatar } from '@/components/initials-avatar'
import { getSettingsCopy } from './settings-copy'
import { useSettingsData } from './settings-data'
import { ThemePreview } from './theme-preview'

const SettingRow = ({
  title,
  description,
  value,
  children,
  onClick,
  destructive = false,
}: {
  title: string
  description?: string
  value?: string
  children?: ReactNode
  onClick?: () => void
  destructive?: boolean
}) => {
  const content = (
    <>
      <div className="min-w-0 flex-1 text-start">
        <Typography
          size={14}
          className={destructive ? 'block text-red-text' : 'block'}
        >
          {title}
        </Typography>
        {description && (
          <p className="mt-1 text-12 text-secondary">{description}</p>
        )}
      </div>
      {value && <span className="text-14 text-secondary">{value}</span>}
      {children ??
        (onClick ? (
          <ArrowLineRightIcon
            size={16}
            aria-hidden
            className="text-secondary"
          />
        ) : null)}
    </>
  )
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-9 w-full items-center gap-4 rounded-16 px-3 py-2 hover:bg-black-4 focus-ring"
    >
      {content}
    </button>
  ) : (
    <div className="flex min-h-9 items-center gap-4 px-3 py-2">{content}</div>
  )
}

const ChoiceRow = ({
  title,
  description,
  value,
  choices,
  onChange,
  hideValue = false,
}: {
  title: string
  description?: string
  value: string
  choices: Record<string, string>
  onChange: (value: string) => void
  hideValue?: boolean
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        aria-label={title}
        className="flex min-h-14 w-full items-center gap-4 rounded-16 px-3 py-2 text-start hover:bg-black-4 focus-ring"
      >
        <span className="min-w-0 flex-1">
          <Typography size={14} className="block">
            {title}
          </Typography>
          {description && (
            <span className="mt-1 block text-12 text-secondary">
              {description}
            </span>
          )}
        </span>
        {!hideValue && (
          <span className="text-14 text-secondary">{choices[value]}</span>
        )}
        <ArrowLineRightIcon size={16} aria-hidden className="text-secondary" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
        {Object.entries(choices).map(([key, label]) => (
          <DropdownMenuRadioItem key={key} value={key}>
            {label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)

export const PreferencesPanel = ({ tab = 'profile' }: { tab?: string }) => {
  const { data, update } = useSettingsData()
  const { dict, lang, setLang, theme, setTheme } = usePreferences()
  const t = getSettingsCopy(lang)
  const id = useId()
  const [editing, setEditing] = useState<'name' | 'email' | 'password' | null>(
    null,
  )
  const [draft, setDraft] = useState('')
  const [selected, setSelected] = useState(tab)
  const sections = [
    ['profile', data.name, null],
    ['theme', t.theme, PaletteIcon],
    ['language', t.timeLanguage, SunHorizonIcon],
    ['notifications', t.notifications, BellIcon],
    ['privacy', t.privacy, HandPalmIcon],
    ['payment', t.paymentTab, CurrencyCircleDollarIcon],
    ['plugins', t.plugins, PlugsConnectedIcon],
  ] as const
  const edit = (key: 'name' | 'email' | 'password') => {
    setDraft(key === 'password' ? '' : data[key])
    setEditing(key)
  }
  const heading = (text: string) => (
    <Typography asChild size={18} semibold>
      <h2 className="px-3">{text}</h2>
    </Typography>
  )
  const saved = () => toast({ status: 'success', title: dict.settings.saved })
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-7 rounded-24 bg-background-2 bg-[linear-gradient(180deg,rgba(215.21,208.25,255,0.2),rgba(202.94,220.64,255,0.5))] px-4 py-12 md:px-12 xl:px-33">
      <div className="flex w-full max-w-294 items-center justify-between gap-4 px-2">
        <GearSixIcon size={48} aria-hidden />
        <Typography asChild size={48} semibold>
          <h1>{dict.settings.title}</h1>
        </Typography>
        <Button
          asChild
          startContent={<CloseIcon />}
          className="size-10 rounded-12 bg-black-4"
        >
          <Link href="/dashboard" aria-label={t.close} />
        </Button>
      </div>
      <Tabs
        value={selected}
        onValueChange={setSelected}
        orientation="vertical"
        className="grid w-full max-w-294 overflow-hidden rounded-32 bg-background-1 md:grid-cols-[17.5rem_minmax(0,1fr)]"
      >
        <TabsList
          variant="solid"
          aria-label={dict.settings.sections}
          className="flex flex-col items-stretch justify-start gap-1 rounded-none bg-background-2 p-6 max-md:flex-row max-md:overflow-x-auto"
        >
          {sections.map(([key, title, Icon]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="min-h-14 justify-start gap-2 rounded-16 px-4 text-14 font-normal text-black data-[state=active]:bg-black-10"
              icon={
                Icon ? (
                  <Icon size={24} className="size-6" />
                ) : (
                  <InitialsAvatar name={data.name} />
                )
              }
            >
              {title}
            </TabsTrigger>
          ))}
        </TabsList>
        <div
          className={`min-w-0 p-6 md:py-7 ${selected === 'profile' ? 'md:min-h-166' : 'md:min-h-169'}`}
        >
          <TabsContent value="profile" className="mt-0 flex flex-col gap-2">
            <div className="flex items-center gap-4 px-3 pb-4">
              <InitialsAvatar name={data.name} size={48} />
              <div>
                <Typography size={18} semibold>
                  {data.name}
                </Typography>
                <p className="text-14">{data.email}</p>
              </div>
            </div>
            <SettingRow
              title={t.name}
              value={data.name}
              onClick={() => edit('name')}
            />
            <div className="flex h-4 items-center px-3">
              <hr className="w-full border-black-10" />
            </div>
            {heading(t.accountSecurity)}
            <div className="flex flex-col gap-2">
              <SettingRow
                title={lang === 'en' ? 'Email' : t.email}
                value={data.email}
                onClick={() => edit('email')}
              />
              <SettingRow
                title={t.password}
                description={t.passwordHint}
                onClick={() => edit('password')}
              />
              <SettingRow
                title={t.twoFactor}
                description={t.twoFactorHint}
                value={data.twoFactor ? t.on : t.off}
                onClick={() => update({ twoFactor: !data.twoFactor })}
              />
            </div>
            <div className="flex h-4 items-center px-3">
              <hr className="w-full border-black-10" />
            </div>
            {heading(t.support)}
            <div className="flex flex-col gap-2">
              <SettingRow title={t.supportAccess} description={t.supportHint}>
                <Switch
                  aria-label={t.supportAccess}
                  checked={data.support}
                  onCheckedChange={(support) => update({ support })}
                />
              </SettingRow>
              <SettingRow
                title={t.logout}
                description={t.logoutHint}
                onClick={() =>
                  toast({
                    title: t.logout,
                    description: dict.settings.savedDescription,
                  })
                }
              />
              <SettingRow
                title={t.delete}
                description={t.deleteHint}
                destructive
                onClick={() =>
                  toast({
                    title: t.delete,
                    description: dict.settings.savedDescription,
                  })
                }
              />
            </div>
          </TabsContent>
          <TabsContent value="theme" className="mt-0 flex flex-col gap-2">
            {heading(t.theme)}
            <RadioGroup
              aria-label={t.theme}
              value={theme}
              onValueChange={(value) => {
                if (value === 'light' || value === 'dark' || value === 'system')
                  setTheme(value)
              }}
              className="flex gap-5 px-3"
            >
              {(['system', 'light', 'dark'] as const).map((value) => (
                <Label
                  key={value}
                  htmlFor={`${id}-${value}`}
                  className="relative flex flex-col gap-2 text-12 text-black has-focus-visible:ring-4 has-focus-visible:ring-black-80"
                >
                  <ThemePreview value={value} selected={theme === value} />
                  <RadioGroupItem
                    id={`${id}-${value}`}
                    value={value}
                    className="absolute inset-0 size-full opacity-0"
                  />
                  {value === 'light'
                    ? dict.header.themeLight
                    : value === 'dark'
                      ? dict.header.themeDark
                      : dict.header.themeSystem}
                </Label>
              ))}
            </RadioGroup>
            <div className="flex h-4 items-center px-3">
              <hr className="w-full border-black-10" />
            </div>
            {heading(t.fontSize)}
            <div className="flex h-14 w-full max-w-80 items-center gap-4 px-4 py-3">
              <TextAaIcon size={20} aria-hidden className="shrink-0" />
              <RadioGroup
                aria-label={t.fontSize}
                orientation="horizontal"
                value={String(data.fontSize)}
                onValueChange={(value) => update({ fontSize: Number(value) })}
                className="flex min-w-0 flex-1 items-center gap-0"
              >
                {[12, 14, 16, 18, 20].map((size, index) => (
                  <Fragment key={size}>
                    {index > 0 && (
                      <span aria-hidden className="h-px flex-1 bg-black-20" />
                    )}
                    <span
                      className={`flex shrink-0 items-center justify-center ${data.fontSize === size ? 'size-8' : 'size-5'}`}
                    >
                      <RadioGroupItem
                        value={String(size)}
                        aria-label={`${size}px`}
                        className="size-3 bg-transparent inset-ring-[0.5px] data-[state=checked]:size-7 data-[state=checked]:bg-black-20 data-[state=checked]:inset-ring-0"
                      />
                    </span>
                  </Fragment>
                ))}
              </RadioGroup>
              <TextAaIcon size={32} aria-hidden className="shrink-0" />
            </div>
            <div className="flex h-4 items-center px-3">
              <hr className="w-full border-black-10" />
            </div>
            {heading(t.color)}
            <RadioGroup
              aria-label={t.color}
              orientation="horizontal"
              value={data.accent}
              onValueChange={(accent) => update({ accent })}
              className="flex flex-wrap gap-4 px-3"
            >
              {(
                ['indigo', 'yellow', 'red', 'blue', 'orange', 'green'] as const
              ).map((color) => (
                <Label
                  key={color}
                  htmlFor={`${id}-accent-${color}`}
                  className="relative flex size-10 items-center justify-center rounded-8 text-static-black has-focus-visible:ring-4 has-focus-visible:ring-black-80"
                  style={{ backgroundColor: `var(--color-${color})` }}
                >
                  <input
                    id={`${id}-accent-${color}`}
                    type="radio"
                    name={`${id}-accent`}
                    aria-label={color}
                    className="sr-only"
                    checked={data.accent === color}
                    onChange={() => update({ accent: color })}
                  />
                  {data.accent === color && <CheckIcon size={24} aria-hidden />}
                </Label>
              ))}
            </RadioGroup>
          </TabsContent>
          <TabsContent value="language" className="mt-0 flex flex-col gap-2">
            {heading(t.timeLanguage)}
            <SettingRow title={t.autoZone} description={t.autoZoneHint}>
              <Switch
                aria-label={t.autoZone}
                checked={data.autoTimeZone}
                onCheckedChange={(autoTimeZone) => update({ autoTimeZone })}
              />
            </SettingRow>
            <ChoiceRow
              title={t.timezone}
              description={t.timezoneHint}
              value={data.timezone}
              choices={{ ...dict.timezones, utc: 'UTC+0 Greenwich Mean Time' }}
              onChange={(timezone) => update({ timezone })}
            />
            <ChoiceRow
              title={t.region}
              description={t.regionHint}
              value={lang}
              choices={dict.languages}
              onChange={(value) => {
                if (value === 'en' || value === 'ru') setLang(value)
              }}
              hideValue
            />
            <SettingRow
              title={t.voice}
              description={t.voiceHint}
              onClick={() =>
                toast({
                  title: t.voice,
                  description: dict.settings.savedDescription,
                })
              }
            />
          </TabsContent>
          <TabsContent
            value="notifications"
            className="mt-0 flex flex-col gap-2"
          >
            {heading(t.notifications)}
            <SettingRow title={t.mobilePush} description={t.mobilePushHint}>
              <Switch
                aria-label={t.mobilePush}
                checked={data.notifications.notifications[1]}
                onCheckedChange={(checked) =>
                  update({
                    notifications: {
                      ...data.notifications,
                      notifications: [
                        data.notifications.notifications[0],
                        checked,
                      ],
                    },
                  })
                }
              />
            </SettingRow>
            <SettingRow
              title={t.emailNotifications}
              description={t.emailNotificationsHint}
            >
              <Switch
                aria-label={t.emailNotifications}
                checked={data.notifications.notifications[0]}
                onCheckedChange={(checked) =>
                  update({
                    notifications: {
                      ...data.notifications,
                      notifications: [
                        checked,
                        data.notifications.notifications[1],
                      ],
                    },
                  })
                }
              />
            </SettingRow>
            <SettingRow title={t.alwaysEmail} description={t.alwaysEmailHint}>
              <Switch
                aria-label={t.alwaysEmail}
                checked={data.alwaysEmail}
                onCheckedChange={(alwaysEmail) => update({ alwaysEmail })}
              />
            </SettingRow>
            <SettingRow
              title={t.slackNotifications}
              description={t.slackHint}
              value={data.slack ? t.on : t.off}
              onClick={() => update({ slack: !data.slack })}
            />
          </TabsContent>
          <TabsContent value="privacy" className="mt-0 flex flex-col gap-2">
            {heading(t.privacy)}
            <SettingRow
              title={t.cookies}
              description={t.cookiesHint}
              value={data.cookies ? t.customize : t.off}
              onClick={() => update({ cookies: !data.cookies })}
            />
            <ChoiceRow
              title={t.history}
              description={t.historyHint}
              value={data.historyDays}
              choices={{
                '7': `7 ${t.days}`,
                '30': `30 ${t.days}`,
                '90': `90 ${t.days}`,
              }}
              onChange={(historyDays) => update({ historyDays })}
            />
          </TabsContent>
          <TabsContent value="payment" className="mt-0 flex flex-col gap-4">
            {heading(t.paymentTab)}
            <div
              role="radiogroup"
              aria-label={t.paymentMethod}
              className="grid gap-4 px-3 sm:grid-cols-3"
            >
              {['Visa', 'Mastercard', 'PayPal'].map((method, index) => (
                <Label
                  key={method}
                  htmlFor={`${id}-payment-${index}`}
                  className="flex h-35 flex-col items-start justify-between rounded-16 bg-background-2 px-6 py-4 text-start text-14 font-normal text-black relative has-focus-visible:ring-4 has-focus-visible:ring-black-80"
                >
                  <input
                    id={`${id}-payment-${index}`}
                    type="radio"
                    name={`${id}-payment`}
                    aria-label={method}
                    className="sr-only"
                    checked={data.defaultPayment === index}
                    onChange={() => update({ defaultPayment: index })}
                  />
                  <span className="flex flex-wrap items-center gap-2 font-semibold">
                    {index === 2 ? method : data.name}
                    {data.defaultPayment === index && (
                      <span className="rounded-8 bg-green/15 px-2 py-0.5 text-12 font-normal text-black">
                        {t.default}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold">
                    {index === 2 ? (
                      data.email
                    ) : (
                      <span className="flex gap-2">
                        {(index === 0
                          ? ['9656', '6598', '1236', '4698']
                          : ['1235', '6321', '1343', '7542']
                        ).map((group) => (
                          <span key={group}>{group}</span>
                        ))}
                      </span>
                    )}
                  </span>
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="text-secondary">
                      {index < 2 ? 'Exp 06/25' : ''}
                    </span>
                    <BrandLogo
                      name={
                        index === 0
                          ? 'Visa'
                          : index === 1
                            ? 'Mastercard'
                            : 'PayPal'
                      }
                      size={40}
                    />
                  </span>
                </Label>
              ))}
              <Button
                variant="outline"
                size="md"
                className="h-13 justify-center rounded-16 border-[0.5px] border-dashed border-black-20 inset-ring-0 [&_svg]:size-4"
                startContent={<PlusIcon size={16} />}
                onClick={() =>
                  toast({
                    title: t.paymentMethod,
                    description: dict.settings.savedDescription,
                  })
                }
              >
                {t.paymentMethod}
              </Button>
            </div>
            <div className="relative mx-3">
              <hr className="absolute inset-x-0 border-black-10" />
            </div>
            <div className="flex flex-col gap-1">
              {heading(t.payout)}
              <p className="px-3 text-12 text-secondary">{t.payoutHint}</p>
            </div>
            <Textarea
              aria-label={t.payout}
              placeholder={t.payoutPlaceholder}
              value={data.payoutInfo}
              onChange={(event) => update({ payoutInfo: event.target.value })}
              className="mx-3 min-h-20 w-auto bg-transparent"
            />
          </TabsContent>
          <TabsContent value="plugins" className="mt-0 flex flex-col gap-4">
            {heading(`${t.plugins} 5`)}
            {(
              [
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
                [
                  'Slack',
                  'Slack is a new way to communicate with your team. It’s faster, better organized, and more secure than email.',
                ],
              ] as const
            ).map(([key, description]) => (
              <div
                key={key}
                className="flex min-h-14 items-center gap-4 rounded-16 px-3 py-2 hover:bg-black-4"
              >
                <BrandLogo name={key} size={40} />
                <div className="min-w-0 flex-1">
                  <Typography size={14} semibold className="block">
                    {key}
                  </Typography>
                  <p className="mt-1 text-12 text-secondary">{description}</p>
                </div>
                <Button
                  startContent={<DotsThreeIcon />}
                  aria-label={`${key}: ${t.settings}`}
                  variant="bare"
                  onClick={() =>
                    toast({
                      title: key,
                      description: dict.settings.savedDescription,
                    })
                  }
                />
                <Switch
                  aria-label={key}
                  checked={key === 'Slack' ? data.slack : data.connected[key]}
                  onCheckedChange={(checked) =>
                    key === 'Slack'
                      ? update({ slack: checked })
                      : update({
                          connected: { ...data.connected, [key]: checked },
                        })
                  }
                />
              </div>
            ))}
          </TabsContent>
        </div>
      </Tabs>
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing === 'name'
                ? t.editName
                : editing === 'email'
                  ? t.email
                  : t.password}
            </DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              if (!editing) return
              if (editing !== 'password') update({ [editing]: draft.trim() })
              setEditing(null)
              saved()
            }}
          >
            <Input
              title={
                editing === 'name'
                  ? t.name
                  : editing === 'email'
                    ? t.email
                    : t.password
              }
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              required
              type={
                editing === 'email'
                  ? 'email'
                  : editing === 'password'
                    ? 'password'
                    : 'text'
              }
              minLength={editing === 'password' ? 8 : 1}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="gray">{t.cancel}</Button>
              </DialogClose>
              <Button type="submit" variant="filled">
                {t.save}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
