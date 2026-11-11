import { getDb } from '../db.mjs'

export async function listPublic(_req, res) {
  const db = getDb()
  const groups = await db.lifeGroup.findMany({
    where: { active: true },
    include: { location: true },
    orderBy: [{ city: 'asc' }, { neighborhood: 'asc' }],
  })
  res.json({ groups })
}

export async function createSignup(req, res) {
  const body = req.body ?? {}
  const { fullName, email, phone, city, ageGroup } = body
  if (!fullName || !email || !phone || !city || !ageGroup) {
    return res.status(400).json({ error: 'Preencha nome, email, telefone, cidade e faixa etária' })
  }
  const db = getDb()
  const signup = await db.lifeGroupSignup.create({
    data: {
      fullName: String(fullName),
      email: String(email).toLowerCase(),
      phone: String(phone),
      city: String(city),
      neighborhood: body.neighborhood ? String(body.neighborhood) : null,
      ageGroup: String(ageGroup),
      message: body.message ? String(body.message) : null,
    },
  })
  res.status(201).json({ signup, message: 'Inscrição recebida. Em breve entraremos em contato.' })
}

export async function listSignups(_req, res) {
  const db = getDb()
  const signups = await db.lifeGroupSignup.findMany({
    include: { lifeGroup: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  res.json({ signups })
}

export async function updateSignup(req, res) {
  const db = getDb()
  const item = await db.lifeGroupSignup.update({
    where: { id: req.params.id },
    data: req.body ?? {},
    include: { lifeGroup: true },
  })
  res.json({ item })
}

export async function listGroupsAdmin(_req, res) {
  const db = getDb()
  const groups = await db.lifeGroup.findMany({
    include: { location: true, _count: { select: { signups: true, reports: true } } },
    orderBy: { name: 'asc' },
  })
  res.json({ groups })
}

export async function createGroup(req, res) {
  const db = getDb()
  const group = await db.lifeGroup.create({ data: req.body ?? {} })
  res.status(201).json({ group })
}

export async function updateGroup(req, res) {
  const db = getDb()
  const group = await db.lifeGroup.update({ where: { id: req.params.id }, data: req.body ?? {} })
  res.json({ group })
}

export async function deleteGroup(req, res) {
  const db = getDb()
  await db.lifeGroup.delete({ where: { id: req.params.id } })
  res.status(204).end()
}

export async function listReports(_req, res) {
  const db = getDb()
  const reports = await db.lifeGroupReport.findMany({
    include: { lifeGroup: true },
    orderBy: { weekDate: 'desc' },
    take: 100,
  })
  res.json({ reports })
}

export async function createReport(req, res) {
  const db = getDb()
  const body = req.body ?? {}
  if (!body.lifeGroupId || !body.weekDate) {
    return res.status(400).json({ error: 'lifeGroupId e weekDate obrigatórios' })
  }
  const report = await db.lifeGroupReport.create({
    data: {
      ...body,
      weekDate: new Date(body.weekDate),
      authorName: body.authorName ?? req.user?.name,
    },
  })
  res.status(201).json({ report })
}
