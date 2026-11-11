import { getDb } from '../db.mjs'

export async function listMinistriesPublic(_req, res) {
  const db = getDb()
  const ministries = await db.ministry.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  })
  res.json({ ministries })
}

export async function createVolunteerSignup(req, res) {
  const body = req.body ?? {}
  const { fullName, email, phone } = body
  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios' })
  }
  const db = getDb()
  const signup = await db.volunteerSignup.create({
    data: {
      fullName: String(fullName),
      email: String(email).toLowerCase(),
      phone: String(phone),
      ministryId: body.ministryId || null,
      ministryLabel: body.ministryLabel ? String(body.ministryLabel) : null,
      message: body.message ? String(body.message) : null,
    },
  })
  res.status(201).json({ signup, message: 'Obrigado! Nossa equipe entrará em contato.' })
}

export async function listVolunteerSignups(_req, res) {
  const db = getDb()
  const signups = await db.volunteerSignup.findMany({
    include: { ministry: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  res.json({ signups })
}

export async function patchVolunteerSignup(req, res) {
  const db = getDb()
  const item = await db.volunteerSignup.update({
    where: { id: req.params.id },
    data: req.body ?? {},
    include: { ministry: true },
  })
  res.json({ item })
}
