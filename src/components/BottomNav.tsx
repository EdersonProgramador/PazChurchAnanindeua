import { Calendar, Church, Home, MoreHorizontal, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/paz-church', label: 'Paz Church', icon: Church },
  { to: '/programacao', label: 'Programação', icon: Calendar },
  { to: '/life-groups', label: 'Life Groups', icon: Users },
  { to: '/mais', label: 'Mais', icon: MoreHorizontal },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-lg -translate-x-1/2 bg-paz-navy px-2 pb-safe pt-2 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      <ul className="grid grid-cols-5 gap-1">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span className="leading-tight">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
