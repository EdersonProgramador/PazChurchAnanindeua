import { getDb } from '../db.mjs'

const crud = {
  roles: 'role',
  permissions: 'permission',
  functions: 'orgFunction',
}

export async function listEntity(req, res) {
  const model = crud[req.params.entity]
  if (!model) return res.status(404).json({ error: 'Entidade desconhecida' })
  const db = getDb()
  const items = await db[model].findMany({
    orderBy: { createdAt: 'desc' },
    ...(model === 'role'
      ? { include: { permissions: { include: { permission: true } } } }
      : {}),
  })
  res.json({ items })
}

export async function createEntity(req, res) {
  const model = crud[req.params.entity]
  if (!model) return res.status(404).json({ error: 'Entidade desconhecida' })
  const db = getDb()
  const body = req.body ?? {}
  if (model === 'role' && body.permissionIds) {
    const { permissionIds, ...data } = body
    const role = await db.role.create({ data })
    if (Array.isArray(permissionIds) && permissionIds.length) {
      await db.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId: role.id, permissionId })),
        skipDuplicates: true,
      })
    }
    return res.status(201).json({ item: role })
  }
  const item = await db[model].create({ data: body })
  res.status(201).json({ item })
}

export async function updateEntity(req, res) {
  const model = crud[req.params.entity]
  if (!model) return res.status(404).json({ error: 'Entidade desconhecida' })
  const db = getDb()
  const body = req.body ?? {}
  if (model === 'role' && body.permissionIds) {
    const { permissionIds, ...data } = body
    const item = await db.role.update({ where: { id: req.params.id }, data })
    await db.rolePermission.deleteMany({ where: { roleId: req.params.id } })
    if (Array.isArray(permissionIds)) {
      await db.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId: req.params.id, permissionId })),
        skipDuplicates: true,
      })
    }
    return res.json({ item })
  }
  const item = await db[model].update({ where: { id: req.params.id }, data: body })
  res.json({ item })
}

export async function deleteEntity(req, res) {
  const model = crud[req.params.entity]
  if (!model) return res.status(404).json({ error: 'Entidade desconhecida' })
  const db = getDb()
  await db[model].delete({ where: { id: req.params.id } })
  res.status(204).end()
}

export async function listUsers(_req, res) {
  const db = getDb()
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      active: true,
      role: true,
      function: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ users })
}
