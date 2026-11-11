export const CHURCH = {
  name: 'Paz Church Ananindeua',
  tagline: 'Da Amazônia para o mundo',
  locale: 'Paz Church Metrópole - Ananindeua',
  address: 'Rodovia BR-316 KM 5, S/N',
  city: 'Guanabara, Ananindeua',
  state: 'PA',
  cep: '67110-140',
  facebook: 'https://www.facebook.com/pages/Paz%20Church%20Ananindeua/2017134335074716/',
  site: 'https://paz.church/belem/events/local/paz-church-metropole-ananindeua/',
  /** Centro aproximado — Paz Church Metrópole BR-316 */
  mapLat: -1.3658,
  mapLng: -48.3724,
  mapsQuery: 'Paz Church Metrópole Ananindeua, Rodovia BR-316 KM 5, Guanabara, Ananindeua, PA',
  hours: [
    'Culto de Celebração — domingo 8h e 18h',
    'TADEL — domingo 10h (quando programado)',
    'Life Groups — durante a semana',
  ],
}

export const STATIC_COPY: Record<string, Record<string, string>> = {
  'paz-church/visao': {
    title: 'Nossa visão',
    body:
      'Formar discípulos que amam a Deus, amam as pessoas e servem o Reino — em família, em Life Groups e na missão local e global, como a rede Paz Church em Belém.',
  },
  'paz-church/pastores': {
    title: 'Nossos Pastores',
    body: 'A liderança de Paz Church Ananindeua serve com o coração voltado a discipulado, família e missão na região metropolitana de Belém.',
  },
  'paz-church/localizacao': {
    title: 'Localização',
    body: `${CHURCH.address}\n${CHURCH.city} — ${CHURCH.state}\nCEP ${CHURCH.cep}`,
  },
  'paz-church/horarios': {
    title: 'Horários',
    body: CHURCH.hours.join('\n'),
  },
  'mais/contribua': {
    title: 'Contribua',
    body: 'Sua generosidade sustenta a missão local. Entre em contato com a secretaria para Pix, transferência e doação online.',
  },
  'mais/voluntario': {
    title: 'Seja um Voluntário',
    body: 'Servir é parte da nossa cultura. Ministérios: Atmosfera, Paz Kids, Amor em Ação, Recepção e Mídia.',
  },
  'mais/pregacoes': {
    title: 'Pregações',
    body: 'Acompanhe cultos, séries e mensagens especiais de Paz Church Ananindeua.',
  },
  'life-groups/casas': {
    title: 'Missão: Casas de Paz',
    body:
      'Life Groups são comunidades pequenas que se encontram semanalmente para comunhão, estudo e missão — como em paz.church/belem/lifegroups.',
  },
  'life-groups/enderecos': {
    title: 'Endereços de Life Group',
    body: 'Consulte a lista atualizada na aba Life Groups ou inscreva-se para ser conectado a um grupo próximo.',
  },
}
