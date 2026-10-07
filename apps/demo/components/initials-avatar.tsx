import { Avatar, AvatarFallback, AvatarImage, IconBox } from '@holakirr/snow-ui'
import { avatarTint, initials } from '@/lib/data'

const TEXT_SIZES = {
  16: 'text-[8px]',
  24: 'text-12',
  40: 'text-14',
  48: 'text-18',
  80: 'text-24',
}

/** Original kit portraits. Initials remain the fallback for user-edited names. */
const portraits: Record<string, string> = {
  ByeWind: '/avatars/byewind.png',
  'Melody Macy': '/avatars/melody-macy.png',
  'Drew Cano': '/avatars/drew-cano.png',
  'Andi Lane': '/avatars/andi-lane.png',
  'Koray Okumus': '/avatars/koray-okumus.png',
  'Natali Craig': '/avatars/natali-craig.png',
  'Orlando Diggs': '/avatars/orlando-diggs.png',
  'Kate Morrison': '/avatars/kate-morrison.png',
}
export const InitialsAvatar = ({
  name,
  size = 24,
}: {
  name: string
  size?: 16 | 24 | 40 | 48 | 80
}) => (
  <IconBox size={size} aria-hidden>
    <Avatar>
      {portraits[name] && <AvatarImage src={portraits[name]} alt="" />}
      <AvatarFallback className={avatarTint(name)}>
        <span className={TEXT_SIZES[size]}>{initials(name)}</span>
      </AvatarFallback>
    </Avatar>
  </IconBox>
)
