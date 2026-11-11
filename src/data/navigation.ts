import type { LucideIcon } from 'lucide-react'

export type NavChild = { label: string; to: string; external?: string }
export type NavItem = { label: string; to?: string; children?: NavChild[] }

export const MAIN_NAV: NavItem[] = [
  {
    label: 'Sobre nós',
    children: [
      { label: 'Quem somos', to: '/paz-church' },
      { label: 'Pastores', to: '/paz-church/pastores' },
      { label: 'Nossa visão', to: '/paz-church/visao' },
      { label: 'Localização', to: '/paz-church/localizacao' },
    ],
  },
  {
    label: 'Mensagens',
    children: [
      { label: 'Cultos', to: '/mensagens' },
      { label: 'Liderança', to: '/mensagens?cat=Liderança' },
      { label: 'Pregações', to: '/mais/pregacoes' },
    ],
  },
  { label: 'Agenda', to: '/agenda' },
  { label: 'Contribua', to: '/contribua' },
  { label: 'Contato', to: '/contato' },
  {
    label: 'Conecte-se',
    children: [
      { label: 'Life Groups', to: '/life-groups' },
      { label: 'Voluntários', to: '/mais/voluntario' },
      { label: 'Inscrição LG', to: '/life-groups/inscricao' },
    ],
  },
  { label: '+ Cidades', to: 'https://paz.church/' },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Sobre',
    links: [
      { label: 'Paz Ananindeua', to: '/' },
      { label: 'Quem somos', to: '/paz-church' },
      { label: 'Pastores', to: '/paz-church/pastores' },
    ],
  },
  {
    title: 'Mídia',
    links: [
      { label: 'Mensagens', to: '/mensagens' },
      { label: 'Agenda', to: '/agenda' },
      { label: 'Facebook', to: 'https://www.facebook.com/pages/Paz%20Church%20Ananindeua/2017134335074716/', external: true },
    ],
  },
  {
    title: 'Conecte-se',
    links: [
      { label: 'Life Groups', to: '/life-groups' },
      { label: 'Voluntário', to: '/mais/voluntario' },
      { label: 'Contribua', to: '/contribua' },
    ],
  },
  {
    title: 'Contato',
    links: [
      { label: 'BR-316 KM 5, Ananindeua', to: '/paz-church/localizacao' },
      { label: 'paz.church/belem', to: 'https://paz.church/belem/', external: true },
    ],
  },
] as const
