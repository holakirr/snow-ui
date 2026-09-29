'use client'

import {
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@holakirr/snow-ui'
import { type ReactNode, useId } from 'react'
import { usePreferences } from '@/app/providers'
import { DIRS, isDir, isLang, isTheme, LANGS, THEMES } from '@/lib/preferences'
import { SettingsSection } from './section'

const Choices = ({
  legend,
  name,
  value,
  options,
  onValueChange,
  disabled,
  hint,
}: {
  legend: string
  name: string
  value: string
  options: { value: string; label: ReactNode }[]
  onValueChange?: (value: string) => void
  disabled?: boolean
  hint?: string
}) => {
  const baseId = useId()
  return (
    <fieldset className="flex flex-col gap-3" disabled={disabled}>
      <Typography asChild size={14} semibold>
        <legend className="mb-3">{legend}</legend>
      </Typography>
      <RadioGroup
        name={name}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        className="flex flex-wrap gap-x-6 gap-y-3"
        aria-describedby={hint ? `${baseId}-hint` : undefined}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              id={`${baseId}-${option.value}`}
            />
            <Label
              htmlFor={`${baseId}-${option.value}`}
              className={`text-14 ${disabled ? 'text-secondary' : 'text-black'}`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {hint && (
        <Typography id={`${baseId}-hint`} size={12} className="text-secondary">
          {hint}
        </Typography>
      )}
    </fieldset>
  )
}

/**
 * The appearance tab: theme, language and direction apply at once (the same
 * preferences as the header's controls); density is a disabled placeholder.
 */
export const AppearanceForm = () => {
  const { dict, theme, setTheme, lang, setLang, dir, setDir } = usePreferences()
  const t = dict.settings.appearance
  const languageId = useId()

  return (
    <SettingsSection
      id="appearance-heading"
      title={t.heading}
      description={t.hint}
    >
      <div className="flex flex-col gap-6">
        <Choices
          legend={t.theme}
          name="theme"
          value={theme}
          onValueChange={(value) => {
            if (isTheme(value)) setTheme(value)
          }}
          options={THEMES.map((value) => ({
            value,
            label:
              dict.header[
                value === 'light'
                  ? 'themeLight'
                  : value === 'dark'
                    ? 'themeDark'
                    : 'themeSystem'
              ],
          }))}
        />

        <div className="flex flex-col gap-2">
          <Label
            htmlFor={languageId}
            className="text-14 font-semibold text-black"
          >
            {t.language}
          </Label>
          <Select
            value={lang}
            onValueChange={(value) => {
              if (isLang(value)) setLang(value)
            }}
          >
            <SelectTrigger id={languageId} className="sm:max-w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGS.map((value) => (
                <SelectItem key={value} value={value} lang={value}>
                  {dict.languages[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Choices
          legend={t.direction}
          name="direction"
          value={dir}
          onValueChange={(value) => {
            if (isDir(value)) setDir(value)
          }}
          options={DIRS.map((value) => ({
            value,
            label:
              value === 'rtl'
                ? dict.header.directionRtl
                : dict.header.directionLtr,
          }))}
        />

        <Choices
          legend={t.density}
          name="density"
          value="comfortable"
          disabled
          hint={t.densityHint}
          options={[
            { value: 'comfortable', label: t.comfortable },
            { value: 'compact', label: t.compact },
          ]}
        />
      </div>
    </SettingsSection>
  )
}
