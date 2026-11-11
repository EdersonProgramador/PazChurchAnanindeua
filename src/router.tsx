import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import { AdminPage } from './pages/AdminPage'
import { HomePage } from './pages/HomePage'
import { LifeGroupsPage } from './pages/LifeGroupsPage'
import { LoginPage } from './pages/LoginPage'
import { MensagensPage } from './pages/MensagensPage'
import { PazChurchPage } from './pages/PazChurchPage'
import { SchedulePage } from './pages/SchedulePage'
import { StaticSectionPage } from './pages/StaticSectionPage'
import { LifeGroupSignupPage } from './pages/LifeGroupSignupPage'
import { GestaoPage } from './pages/GestaoPage'
import { VolunteerSignupPage } from './pages/VolunteerSignupPage'
import { ContribuaPage } from './pages/ContribuaPage'
import { ContatoPage } from './pages/ContatoPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="paz-church" element={<PazChurchPage />} />
        <Route path="paz-church/:section" element={<StaticSectionPage base="paz-church" />} />
        <Route path="agenda" element={<SchedulePage />} />
        <Route path="programacao" element={<Navigate to="/agenda" replace />} />
        <Route path="mensagens" element={<MensagensPage />} />
        <Route path="life-groups" element={<LifeGroupsPage />} />
        <Route path="life-groups/inscricao" element={<LifeGroupSignupPage />} />
        <Route path="life-groups/:section" element={<StaticSectionPage base="life-groups" />} />
        <Route path="contribua" element={<ContribuaPage />} />
        <Route path="mais/contribua" element={<Navigate to="/contribua" replace />} />
        <Route path="mais/voluntario" element={<VolunteerSignupPage />} />
        <Route path="mais/pregacoes" element={<Navigate to="/mensagens" replace />} />
        <Route path="mais/:section" element={<StaticSectionPage base="mais" />} />
        <Route path="contato" element={<ContatoPage />} />
        <Route path="mais" element={<Navigate to="/contato" replace />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="gestao" element={<GestaoPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
