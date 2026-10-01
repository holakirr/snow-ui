'use client'

import { useComposedRefs } from '@radix-ui/react-compose-refs'
import { Slot } from '@radix-ui/react-slot'
import {
  type ComponentProps,
  cloneElement,
  createContext,
  type FC,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { twMerge } from '../../utils/tw-merge'

import { Label, type LabelProps } from '../Label'
import { Typography } from '../Text'

/**
 * Validation state of a single field. Form components are library-agnostic:
 * pass the state via `FormItem` props, or provide it with `FormFieldState`
 * (this is how adapters such as `@holakirr/snow-ui/react-hook-form` work).
 */
type FormFieldStateValue = {
  name?: string
  /** Error message; a truthy value also marks the field invalid */
  error?: ReactNode
  invalid?: boolean
}

const FormFieldStateContext = createContext<FormFieldStateValue>({})

const FormFieldState = FormFieldStateContext.Provider

/** The parts that describe the control. */
type FormPart = 'description' | 'message'

type FormItemContextValue = FormFieldStateValue & {
  id: string
  /** The ids of the rendered description and message, for `FormControl`. */
  describedBy?: string
  /** Marks a rendered part (with its id) until the returned cleanup. */
  registerPart?: (part: FormPart, id: string) => () => void
}

const FormItemContext = createContext<FormItemContextValue | null>(null)

const formFieldIds = (id: string) => ({
  formItemId: `${id}-form-item`,
  formDescriptionId: `${id}-form-item-description`,
  formMessageId: `${id}-form-item-message`,
})

/** What `FormMessage` shows: the error, or its children without one. */
const messageBody = (error: ReactNode, children: ReactNode) =>
  error && error !== true ? error : children

/** Space-separated ids without repeats, or `undefined` when there are none. */
const idList = (...ids: (string | undefined)[]) =>
  [...new Set(ids.flatMap((id) => id?.split(/\s+/) ?? []))]
    .filter(Boolean)
    .join(' ') || undefined

type PartProps = { id?: string; children?: ReactNode }

/**
 * The ids of the description and message that the item's children will
 * render, read from the element tree: what the server renders (no DOM
 * there) and the first client render, so hydration matches. Parts inside
 * your own components, or behind an iterator (which reading would use up),
 * aren't visible here; the client adds them after the first render. A
 * nested `FormItem` has parts of its own.
 */
const predictedIds = (
  children: ReactNode,
  { formDescriptionId, formMessageId }: ReturnType<typeof formFieldIds>,
  error: ReactNode,
) => {
  const description: string[] = []
  const message: string[] = []
  const visit = (node: ReactNode) => {
    if (Array.isArray(node)) {
      for (const child of node) visit(child)
      return
    }
    if (!isValidElement<PartProps>(node) || node.type === FormItem) return
    if (node.type === FormDescription) {
      description.push(node.props.id ?? formDescriptionId)
    } else if (node.type === FormMessage) {
      if (messageBody(error, node.props.children)) {
        message.push(node.props.id ?? formMessageId)
      }
    } else {
      visit(node.props.children)
    }
  }
  visit(children)
  return idList(...description, ...message)
}

/** Marks our parts, which register themselves, for the DOM lookup. */
const partSlots = new Set(['form-description', 'form-message'])

/**
 * The ids for `aria-describedby`: the registered `FormDescription` and
 * `FormMessage` parts (in a portal too), and your own parts with the ids of
 * `useFormField()` found in the item's document (or inside the item when it
 * isn't attached to one). Descriptions come before messages. Our parts are
 * left to their registration: a part's cleanup runs before React removes
 * its element.
 */
const renderedIds = (
  item: HTMLElement | null,
  parts: Iterable<{ part: FormPart; id: string }>,
  { formDescriptionId, formMessageId }: ReturnType<typeof formFieldIds>,
) => {
  const registered = [...parts]
  const idsOf = (part: FormPart) =>
    registered.filter((entry) => entry.part === part).map(({ id }) => id)
  const root = item?.getRootNode()
  const isRendered = (id: string) => {
    if (!item) return false
    const element =
      root && 'getElementById' in root
        ? (root as Document | ShadowRoot).getElementById(id)
        : Array.from(item.querySelectorAll('[id]')).find(
            (candidate) => candidate.id === id,
          )
    return !!element && !partSlots.has(element.getAttribute('data-slot') ?? '')
  }
  return idList(
    ...idsOf('description'),
    isRendered(formDescriptionId) ? formDescriptionId : undefined,
    ...idsOf('message'),
    isRendered(formMessageId) ? formMessageId : undefined,
  )
}

/** Registers a rendered part (`id` undefined: not rendered) with its item. */
const useFormPart = (part: FormPart, id: string | undefined) => {
  const registerPart = useContext(FormItemContext)?.registerPart
  useLayoutEffect(
    () => (id && registerPart ? registerPart(part, id) : undefined),
    [registerPart, part, id],
  )
}

const useFormField = () => {
  const itemContext = useContext(FormItemContext)

  if (!itemContext) {
    throw new Error('useFormField should be used within <FormItem>')
  }

  const { id, name, error, invalid } = itemContext

  return {
    id,
    name,
    error,
    invalid: invalid ?? Boolean(error),
    ...formFieldIds(id),
  }
}

type FormProps = ComponentProps<'form'>

const Form: FC<FormProps> = (props) => <form {...props} />

Form.displayName = 'Form'

type FormItemProps = ComponentProps<'div'> & FormFieldStateValue

const FormItem: FC<FormItemProps> = ({
  className,
  name,
  error,
  invalid,
  ref,
  children,
  ...props
}) => {
  const id = useId()
  const fieldState = useContext(FormFieldStateContext)
  const itemError = error ?? fieldState.error
  const itemRef = useRef<HTMLDivElement>(null)
  const setRef = useComposedRefs(itemRef, ref)
  const [parts] = useState(
    () => new Map<object, { part: FormPart; id: string }>(),
  )
  // `aria-describedby` only lists the parts that are rendered. The server
  // (and hydration) renders the ids predicted from the children; after
  // that, the parts register while they are rendered, and your own parts
  // are looked up by id.
  const [describedBy, setDescribedBy] = useState(() =>
    predictedIds(children, formFieldIds(id), itemError),
  )
  const current = useRef(describedBy)

  // Sets the state only when the ids change, so a check that finds nothing
  // new (after a registration, say) doesn't render outside `act()`.
  const update = useCallback(() => {
    const next = renderedIds(itemRef.current, parts.values(), formFieldIds(id))
    if (next !== current.current) {
      current.current = next
      setDescribedBy(next)
    }
  }, [id, parts])

  const registerPart = useCallback(
    (part: FormPart, partId: string) => {
      const key = {}
      parts.set(key, { part, id: partId })
      update()
      return () => {
        parts.delete(key)
        update()
      }
    },
    [parts, update],
  )

  // After every render, before paint (your own parts that follow the
  // field's state), and when the item's children or their ids change on
  // their own.
  useLayoutEffect(update)
  useLayoutEffect(() => {
    const item = itemRef.current
    if (!item || typeof MutationObserver === 'undefined') return
    const observer = new MutationObserver(update)
    observer.observe(item, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id'],
    })
    return () => observer.disconnect()
  }, [update])

  return (
    <FormItemContext.Provider
      value={{
        id,
        name: name ?? fieldState.name,
        error: itemError,
        invalid: invalid ?? fieldState.invalid,
        describedBy,
        registerPart,
      }}
    >
      <div
        ref={setRef}
        className={twMerge('relative space-y-2', className)}
        {...props}
      >
        {children}
      </div>
    </FormItemContext.Provider>
  )
}

FormItem.displayName = 'FormItem'

/**
 * The field's label. It stays `text-secondary` when the field is invalid, as
 * the kit's title does: the red stroke, the `Warning` icon of a text field
 * and the `FormMessage` mark the error.
 */
const FormLabel: FC<LabelProps> = ({ className, ...props }) => {
  const { formItemId } = useFormField()

  return <Label className={className} htmlFor={formItemId} {...props} />
}

FormLabel.displayName = 'FormLabel'

type FormControlProps = ComponentProps<typeof Slot>

/**
 * Gives its only child the item's id, `aria-invalid`, and an
 * `aria-describedby` with the ids of the rendered `FormDescription` and
 * `FormMessage` (none when neither is rendered), after any
 * `aria-describedby` of its own or of the child.
 */
const FormControl: FC<FormControlProps> = ({
  'aria-describedby': ownDescribedBy,
  children,
  ...props
}) => {
  const { invalid, formItemId } = useFormField()
  const describedBy = useContext(FormItemContext)?.describedBy
  // The child's own value, even `undefined`, would replace the merged one
  // (Slot lets the child's props win), so the child gets the merged list.
  const child = isValidElement<{ 'aria-describedby'?: string }>(children)
    ? children
    : undefined
  const merged = idList(
    ownDescribedBy,
    child?.props['aria-describedby'],
    describedBy,
  )

  return (
    <Slot
      id={formItemId}
      aria-describedby={merged}
      aria-invalid={invalid}
      {...props}
    >
      {child && 'aria-describedby' in child.props
        ? cloneElement(child as ReactElement<{ 'aria-describedby'?: string }>, {
            'aria-describedby': merged,
          })
        : children}
    </Slot>
  )
}

FormControl.displayName = 'FormControl'

type FormDescriptionProps = ComponentProps<'p'>

const FormDescription: FC<FormDescriptionProps> = ({
  className,
  children,
  ...props
}) => {
  const { formDescriptionId } = useFormField()
  useFormPart('description', props.id ?? formDescriptionId)

  return (
    <Typography
      asChild
      className={twMerge('text-12 text-secondary', className)}
    >
      <p id={formDescriptionId} {...props} data-slot="form-description">
        {children}
      </p>
    </Typography>
  )
}

FormDescription.displayName = 'FormDescription'

type FormMessageProps = ComponentProps<'p'>

/**
 * The field's error (or `children` without one), in `red-text`. While the
 * field is invalid it is an alert (WCAG technique ARIA19), so screen readers
 * announce the error when it appears; pass `role="status"` for a polite
 * announcement. A message on a valid field is plain text.
 */
const FormMessage: FC<FormMessageProps> = ({
  className,
  children,
  ...props
}) => {
  const { error, invalid, formMessageId } = useFormField()
  const body = messageBody(error, children)
  useFormPart('message', body ? (props.id ?? formMessageId) : undefined)

  if (!body) {
    return null
  }

  return (
    <Typography asChild className={twMerge('text-12 text-red-text', className)}>
      <p
        id={formMessageId}
        role={invalid ? 'alert' : undefined}
        {...props}
        data-slot="form-message"
      >
        {body}
      </p>
    </Typography>
  )
}

FormMessage.displayName = 'FormMessage'

export {
  Form,
  FormControl,
  type FormControlProps,
  FormDescription,
  type FormDescriptionProps,
  FormFieldState,
  type FormFieldStateValue,
  FormItem,
  type FormItemProps,
  FormLabel,
  FormMessage,
  type FormMessageProps,
  type FormProps,
  useFormField,
}
