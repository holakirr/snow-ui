'use client'

import { Button, Checkbox, Input, toast } from '@holakirr/snow-ui'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@holakirr/snow-ui/react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
// zod/mini: the same schemas, tree-shakable (the classic `zod` build is
// about 110 kB compressed; this page loads a fraction of it).
import * as z from 'zod/mini'
import { useDictionary } from '@/app/providers'
import { EyeIcon, EyeSlashIcon } from '@/components/icons'
import type { Dictionary } from '@/lib/i18n/dictionaries'

const makeSchema = (errors: Dictionary['signIn']['errors']) =>
  z.object({
    email: z.pipe(
      z
        .string()
        .check(z.trim(), z.minLength(1, { error: errors.emailRequired })),
      z.email({ error: errors.emailInvalid }),
    ),
    password: z
      .string()
      .check(
        z.minLength(1, { error: errors.passwordRequired }),
        z.minLength(8, { error: errors.passwordShort }),
      ),
    remember: z.boolean(),
  })

type Values = z.infer<ReturnType<typeof makeSchema>>

/**
 * The sign-in form with the react-hook-form adapter
 * (`@holakirr/snow-ui/react-hook-form`) and zod: `FormField` wires each
 * field's label, `aria-invalid` and error message. Submitting only shows a
 * toast — there is no real authentication.
 */
export const SignInForm = () => {
  const dict = useDictionary()
  const t = dict.signIn
  const schema = useMemo(() => makeSchema(t.errors), [t.errors])
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: true },
  })

  const onSubmit = (values: Values) => {
    toast({
      status: 'success',
      title: t.success,
      description: t.successDescription(values.email),
    })
    form.reset({ ...values, password: '' })
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  title={t.email}
                  type="email"
                  autoComplete="email"
                  placeholder={t.emailPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  title={t.password}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder={t.passwordPlaceholder}
                  endContent={
                    <button
                      type="button"
                      aria-label={t.showPassword}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((shown) => !shown)}
                      className="flex size-6 items-center justify-center rounded-8 text-secondary hover:text-black focus-ring"
                    >
                      {showPassword ? (
                        <EyeSlashIcon size={16} aria-hidden />
                      ) : (
                        <EyeIcon size={16} aria-hidden />
                      )}
                    </button>
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormLabel className="text-14 text-black">
                  {t.remember}
                </FormLabel>
              </FormItem>
            )}
          />
          <Button
            variant="bare"
            label={t.forgot}
            textSize={14}
            onClick={() =>
              toast({ title: t.forgot, description: t.forgotToast })
            }
          />
        </div>
        <Button
          type="submit"
          variant="filled"
          size="lg"
          label={t.submit}
          className="w-full"
        />
      </form>
    </Form>
  )
}
