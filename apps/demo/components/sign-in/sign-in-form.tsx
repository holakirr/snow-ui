'use client'

import { Button, InputSmall, toast } from '@holakirr/snow-ui'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@holakirr/snow-ui/react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
// zod/mini: the same schemas, tree-shakable (the classic `zod` build is
// about 110 kB compressed; this page loads a fraction of it).
import * as z from 'zod/mini'
import { useDictionary } from '@/app/providers'
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

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
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
                <InputSmall
                  variant="outline"
                  className="h-10 w-full px-3"
                  aria-label={t.email}
                  type="email"
                  autoComplete="email"
                  placeholder={t.email}
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
                <InputSmall
                  variant="outline"
                  className="h-10 w-full px-3"
                  aria-label={t.password}
                  type="password"
                  autoComplete="current-password"
                  placeholder={t.password}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            variant="bare"
            label={t.forgot}
            textSize={14}
            className="text-indigo-text"
            onClick={() =>
              toast({ title: t.forgot, description: t.forgotToast })
            }
          />
        </div>
        <Button
          type="submit"
          variant="filled"
          size="md"
          label={t.submit}
          className="mt-3 w-full"
        />
      </form>
    </Form>
  )
}
