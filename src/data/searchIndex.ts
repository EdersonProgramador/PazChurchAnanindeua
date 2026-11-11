export type SearchEntry = {
  title: string
  to: string
  keywords: string
  external?: boolean
}

export const SEARCH_INDEX: SearchEntry[] = [
  { title: 'Home', to: '/', keywords: 'início paz church ananindeua' },
  { title: 'Quem somos', to: '/paz-church', keywords: 'sobre igreja família' },
  { title: 'Pastores', to: '/paz-church/pastores', keywords: 'liderança pastoral' },
  { title: 'Nossa visão', to: '/paz-church/visao', keywords: 'visão missão discipulado' },
  { title: 'Localização e mapa', to: '/paz-church/localizacao', keywords: 'endereço br-316 guanabara mapa como chegar' },
  { title: 'Horários de culto', to: '/paz-church/horarios', keywords: 'domingo celebração tadel 8h 18h' },
  { title: 'Agenda', to: '/agenda', keywords: 'eventos cultos programação calendário' },
  { title: 'Mensagens e pregações', to: '/mensagens', keywords: 'cultos palavra sermão liderança' },
  { title: 'Life Groups', to: '/life-groups', keywords: 'célula células casas de paz' },
  { title: 'Inscrição Life Group', to: '/life-groups/inscricao', keywords: 'participar cadastro' },
  { title: 'Voluntários', to: '/mais/voluntario', keywords: 'servir ministério atmosfera kids' },
  { title: 'Contribua', to: '/contribua', keywords: 'doação dizimo oferta pix' },
  { title: 'Contato', to: '/contato', keywords: 'fale conosco oração email' },
  { title: 'Galeria de fotos', to: '/galeria', keywords: 'fotos imagens cultos eventos' },
  { title: 'Facebook Paz Ananindeua', to: 'https://www.facebook.com/pages/Paz%20Church%20Ananindeua/2017134335074716/', keywords: 'redes sociais', external: true },
  { title: 'Paz Church Belém', to: 'https://paz.church/belem/', keywords: 'rede sede regional', external: true },
]

export function searchSite(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return SEARCH_INDEX.filter((e) => {
    const hay = `${e.title} ${e.keywords}`.toLowerCase()
    return hay.includes(q) || q.split(/\s+/).every((w) => hay.includes(w))
  }).slice(0, limit)
}
