import { Avatar, AvatarFallback, IconBox } from '@holakirr/snow-ui'
import { avatarTint, initials } from '@/lib/data'

const TEXT_SIZES = {
  16: 'text-[8px]',
  24: 'text-12',
  40: 'text-14',
  80: 'text-24',
}

/**
 * A placeholder avatar: the initials on one of the kit's secondary colours
 * (no photos from the Figma kit). The initials are static black, which keeps
 * 4.5:1 on every tint in both themes; the name is always next to it, so the
 * avatar is decorative.
 */
export const InitialsAvatar = ({
  name,
  size = 24,
}: {
  name: string
  size?: 16 | 24 | 40 | 80
}) => (
  <IconBox size={size} aria-hidden>
    <Avatar>
      <AvatarFallback className={avatarTint(name)}>
        {/* AvatarFallback sets 12px text whatever the avatar size. */}
        <span className={TEXT_SIZES[size]}>{initials(name)}</span>
      </AvatarFallback>
    </Avatar>
  </IconBox>
)
