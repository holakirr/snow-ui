import { Button, Card, Typography } from '@holakirr/snow-ui'
import type { ReactNode } from 'react'

/** A settings panel: a Block with its heading, the fields and the actions. */
export const SettingsSection = ({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
}) => (
  <Card variant="block" className="flex max-w-3xl flex-col gap-6">
    <div className="flex flex-col gap-1">
      <Typography asChild size={18} semibold>
        <h2 id={id}>{title}</h2>
      </Typography>
      {description && (
        <Typography size={14} className="text-secondary">
          {description}
        </Typography>
      )}
    </div>
    {children}
  </Card>
)

export const SaveButton = ({ label }: { label: string }) => (
  <div className="flex justify-end">
    <Button type="submit" variant="filled" size="md" label={label} />
  </div>
)
