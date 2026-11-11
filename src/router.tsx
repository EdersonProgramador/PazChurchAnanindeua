import { Navigate, Route, Routes } from 'react-router-dom'
import { MobileShell } from './layouts/MobileShell'
import { AdminPage } from './pages/AdminPage'
import { HomePage } from './pages/HomePage'
import { LifeGroupsPage } from './pages/LifeGroupsPage'
import { LoginPage } from './pages/LoginPage'
import { MorePage } from './pages/MorePage'
import { PazChurchPage } from './pages/PazChurchPage'
import { SchedulePage } from './pages/SchedulePage'
import { StaticSectionPage } from './pages/StaticSectionPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MobileShell />}>
        <Route index element={<HomePage />} />
        <Route path="paz-church" element={<PazChurchPage />} />
        <Route path="paz-church/:section" element={<StaticSectionPage base="paz-church" />} />
        <Route path="programacao" element={<SchedulePage />} />
        <Route path="life-groups" element={<LifeGroupsPage />} />
        <Route path="life-groups/:section" element={<StaticSectionPage base="life-groups" />} />
        <Route path="mais" element={<MorePage />} />
        <Route path="mais/:section" element={<StaticSectionPage base="mais" />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
