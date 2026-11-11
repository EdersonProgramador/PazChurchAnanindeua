import { config as loadEnv } from 'dotenv'
import { existsSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

if (existsSync('.env.local')) loadEnv({ path: '.env.local' })
loadEnv()

const prisma = new PrismaClient()

const PERMISSIONS = [
  { code: 'feed.read', name: 'Ver feed', description: 'Visualizar publicações na home' },
  { code: 'events.read', name: 'Ver agenda', description: 'Visualizar eventos' },
  { code: 'admin.access', name: 'Painel admin', description: 'Acessar área administrativa' },
  { code: 'rbac.manage', name: 'Gerenciar RBAC', description: 'CRUD de cargos, permissões e funções' },
  { code: 'content.manage', name: 'Gerenciar conteúdo', description: 'Feed, eventos e menus' },
  { code: 'storage.write', name: 'Enviar arquivos', description: 'Upload para Object Storage' },
  { code: 'lifegroup.manage', name: 'Gestão Life Groups', description: 'CRUD de células, inscrições e sedes' },
  { code: 'lifegroup.report', name: 'Relatórios LG', description: 'Enviar relatórios semanais' },
] as const

const ROLES = [
  { slug: 'admin', name: 'Administrador', description: 'Acesso total ao sistema', perms: PERMISSIONS.map((p) => p.code) },
  {
    slug: 'lider',
    name: 'Liderança',
    description: 'Gestão de conteúdo e relatórios',
    perms: ['feed.read', 'events.read', 'content.manage', 'storage.write', 'lifegroup.manage', 'lifegroup.report'],
  },
  {
    slug: 'voluntario',
    name: 'Voluntário',
    description: 'Acesso ao app e relatórios básicos',
    perms: ['feed.read', 'events.read'],
  },
  { slug: 'visitante', name: 'Visitante', description: 'Somente leitura pública', perms: ['feed.read', 'events.read'] },
]

const FUNCTIONS = [
  { slug: 'pastor', name: 'Pastor', description: 'Ministério pastoral' },
  { slug: 'life-group', name: 'Líder de Life Group', description: 'Coordenação de células' },
  { slug: 'midia', name: 'Mídia', description: 'Comunicação e redes sociais' },
  { slug: 'recepcao', name: 'Recepção', description: 'Atendimento e acolhimento' },
]

async function main() {
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: p.code },
      create: p,
      update: { name: p.name, description: p.description },
    })
  }

  for (const f of FUNCTIONS) {
    await prisma.orgFunction.upsert({
      where: { slug: f.slug },
      create: f,
      update: { name: f.name, description: f.description },
    })
  }

  for (const r of ROLES) {
    const role = await prisma.role.upsert({
      where: { slug: r.slug },
      create: { slug: r.slug, name: r.name, description: r.description },
      update: { name: r.name, description: r.description },
    })
    for (const code of r.perms) {
      const perm = await prisma.permission.findUnique({ where: { code } })
      if (!perm) continue
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        create: { roleId: role.id, permissionId: perm.id },
        update: {},
      })
    }
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { slug: 'admin' } })
  const pastorFn = await prisma.orgFunction.findUnique({ where: { slug: 'pastor' } })
  const hash = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@pazananindeua.org' },
    create: {
      email: 'admin@pazananindeua.org',
      name: 'Administrador Paz Ananindeua',
      passwordHash: hash,
      roleId: adminRole.id,
      functionId: pastorFn?.id,
    },
    update: { passwordHash: hash, roleId: adminRole.id },
  })

  const feedCount = await prisma.feedPost.count()
  if (feedCount === 0) {
    await prisma.feedPost.createMany({
      data: [
        {
          title: 'O REINO IMPARÁVEL',
          subtitle: 'Paz Church 2026 · Isaías 9.7',
          series: 'Visão 2026',
          imageUrl: '/logo-pazchurchananindeua-9dc3104f-74c5-44ba-af12-06a3856a8947.png',
          sortOrder: 1,
        },
        {
          title: 'FIDELIDADE SOB PRESSÃO',
          subtitle: 'Série: Firmes na Babilônia',
          series: 'Firmes na Babilônia',
          speaker: 'Willey Sandro',
          sortOrder: 2,
        },
        {
          title: 'UMA DECISÃO INEGOCIÁVEL',
          subtitle: 'Culto de Celebração',
          series: 'Mensagens',
          sortOrder: 3,
        },
      ],
    })
  }

  const eventCount = await prisma.churchEvent.count()
  if (eventCount === 0) {
    const now = new Date()
    await prisma.churchEvent.createMany({
      data: [
        {
          title: 'Culto de Celebração — 8h',
          description: 'Culto dominical de celebração',
          startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()), 8, 0),
          recurring: 'Semanal — domingo 8h',
          location: 'Rodovia BR-316 KM 5, Guanabara, Ananindeua/PA',
        },
        {
          title: 'Culto de Celebração — 18h',
          startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()), 18, 0),
          recurring: 'Semanal — domingo 18h',
          location: 'Rodovia BR-316 KM 5, Guanabara, Ananindeua/PA',
        },
        {
          title: 'Life Groups',
          description: 'Encontros semanais nas casas',
          startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 19, 30),
          recurring: 'Semanal',
        },
      ],
    })
  }

  const menuCount = await prisma.menuLink.count()
  if (menuCount === 0) {
    await prisma.menuLink.createMany({
      data: [
        { section: 'paz-church', label: 'Paz Ananindeua', path: '/', icon: 'church', sortOrder: 1 },
        { section: 'paz-church', label: 'Conheça a Nossa Igreja', path: '/paz-church', icon: 'heart', sortOrder: 2 },
        { section: 'paz-church', label: 'Pastores', path: '/paz-church/pastores', icon: 'user', sortOrder: 3 },
        { section: 'paz-church', label: 'Localização', path: '/paz-church/localizacao', icon: 'map-pin', sortOrder: 4 },
        { section: 'paz-church', label: 'Horários', path: '/paz-church/horarios', icon: 'clock', sortOrder: 5 },
        { section: 'life-groups', label: 'Missão: Casas de Paz', path: '/life-groups/casas', icon: 'home', sortOrder: 1 },
        { section: 'life-groups', label: 'Tarefas do Life Group', path: '/life-groups/tarefas', icon: 'list', sortOrder: 2 },
        { section: 'life-groups', label: 'Endereços de Life Group', path: '/life-groups/enderecos', icon: 'map', sortOrder: 3 },
        { section: 'mais', label: 'Contribua', path: '/mais/contribua', icon: 'hand-coins', sortOrder: 1 },
        { section: 'mais', label: 'Seja um Voluntário', path: '/mais/voluntario', icon: 'hand-heart', sortOrder: 2 },
        { section: 'mais', label: 'Pregações', path: '/mais/pregacoes', icon: 'mic', sortOrder: 3 },
        { section: 'mais', label: 'Notificações', path: '/mais/notificacoes', icon: 'bell', sortOrder: 4 },
        {
          section: 'mais',
          label: 'Facebook',
          external: 'https://www.facebook.com/pages/Paz%20Church%20Ananindeua/2017134335074716/',
          icon: 'facebook',
          sortOrder: 5,
        },
      ],
    })
  }

  const inscricao = await prisma.menuLink.findFirst({
    where: { section: 'life-groups', path: '/life-groups/inscricao' },
  })
  if (!inscricao) {
    await prisma.menuLink.create({
      data: {
        section: 'life-groups',
        label: 'Inscrição Life Group',
        path: '/life-groups/inscricao',
        icon: 'heart',
        sortOrder: 0,
      },
    })
  }

  const locCount = await prisma.churchLocation.count()
  if (locCount === 0) {
    const metro = await prisma.churchLocation.create({
      data: {
        name: 'Paz Church Metrópole — Ananindeua',
        slug: 'metropole-ananindeua',
        kind: 'catedral',
        address: 'Rodovia BR-316 KM 5, S/N',
        city: 'Guanabara, Ananindeua',
        schedule: 'Cultos: domingo 8h e 18h · TADEL domingo 10h',
        sortOrder: 1,
      },
    })
    const belem = await prisma.churchLocation.create({
      data: {
        name: 'Sede Regional — Belém',
        slug: 'sede-belem',
        kind: 'regional',
        address: 'Av. Sen. Lemos, 2039 - Telégrafo',
        city: 'Belém',
        schedule: 'Cultos: domingo 9h e 18h',
        sortOrder: 2,
      },
    })
    await prisma.sermon.create({
      data: {
        title: 'O Valor de Uma Vida',
        category: 'Cultos',
        speaker: 'Paz Church Belém',
        featured: true,
        summary: 'Palavra recente — inspiração para a família Paz Ananindeua.',
      },
    })
    await prisma.feedPost.create({
      data: {
        title: 'Como fazer meu Life Group Crescer — Parte 2',
        series: 'Liderança',
        speaker: 'Equipe de Life Groups',
        sortOrder: 0,
      },
    })
    await prisma.lifeGroup.createMany({
      data: [
        {
          name: 'Casas de Paz — Guanabara',
          leaderName: 'Líder Luiz',
          leaderPhone: '(91) 90000-0001',
          address: 'Conjunto Guanabara',
          neighborhood: 'Guanabara',
          dayOfWeek: 'quarta',
          meetingTime: '19:30',
          ageGroup: 'adultos',
          locationId: metro.id,
        },
        {
          name: 'Jovens Paz — Coqueiro',
          leaderName: 'Líder Ana',
          leaderPhone: '(91) 90000-0002',
          address: 'Rua do Coqueiro',
          neighborhood: 'Coqueiro',
          dayOfWeek: 'sexta',
          meetingTime: '20:00',
          ageGroup: 'jovens',
          locationId: metro.id,
        },
        {
          name: 'Paz Kids — Famílias',
          leaderName: 'Líder Carla',
          address: 'Parque Augusto Montenegro',
          neighborhood: 'Parque Verde',
          dayOfWeek: 'sábado',
          meetingTime: '16:00',
          ageGroup: 'criancas',
          locationId: belem.id,
        },
      ],
    })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
