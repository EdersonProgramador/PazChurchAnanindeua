import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'

export function MobileShell() {
  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-paz-light pb-24">
      <Outlet />
      <BottomNav />
    </div>
  )
}
