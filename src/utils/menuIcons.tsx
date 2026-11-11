import {
  Bell,
  ClipboardList,
  Clock,
  HandCoins,
  HandHeart,
  Heart,
  Home,
  Map,
  MapPin,
  Mic,
  User,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  church: Home,
  heart: Heart,
  user: User,
  'map-pin': MapPin,
  clock: Clock,
  home: Home,
  list: ClipboardList,
  map: Map,
  'hand-coins': HandCoins,
  'hand-heart': HandHeart,
  mic: Mic,
  bell: Bell,
}

export function iconForMenu(name?: string | null) {
  if (!name) return ClipboardList
  return map[name] ?? ClipboardList
}
